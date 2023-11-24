var mongoose = require("mongoose");
mongoose.set("runValidators", true);

const ShoppingCart = require("../models/shoppingCart");
const Events = require("../models/events");
const Heritages = require("../models/heritage");
const Promos = require("../models/promo");
const Purchases = require("../models/purchases");

const authController = require("./authController");

var shoppingCartController = {};

shoppingCartController.showCart = async function (req, res) {
  try {
    const events = await Events.find().exec();
    const user = await authController.getAuthenticatedUser(req, res);
    const cart = await ShoppingCart.findOne({ userId: user._id });
    const promos = await Promos.find().exec();

    res.render("shoppingCart/shoppingCart", {
      cart: cart,
      user,
      events,
      promos,
    });
  } catch (err) {
    res.render("error", { message: err.message, error: err });
  }
};

shoppingCartController.addToCart = async function (req, res) {
  try {
    const { event, quantity, total } = req.body;
    const user = await authController.getAuthenticatedUser(req, res);
    const cart = await ShoppingCart.findOne({ userId: user._id });
    const foundEvent = await Events.findById(event);

    if (cart) {
      // Se o carrinho já existe para o usuário, atualize o item correspondente
      const itemIndex = cart.items.findIndex((item) =>
        item.eventId.equals(event)
      );
      if (itemIndex !== -1) {
        // Se o evento já estiver no carrinho, atualize a quantidade e o valor total
        cart.items[itemIndex].quantity += parseInt(quantity);
        cart.total += parseInt(foundEvent.price) * parseInt(quantity);
      } else {
        // Se o evento não estiver no carrinho, adicione um novo item
        const item = {
          eventId: event,
          quantity: parseInt(quantity),
        };
        cart.items.push(item);
        cart.total += parseInt(foundEvent.price) * parseInt(quantity);
      }
      await cart.save();
    } else {
      // Se o carrinho não existir para o usuário, crie um novo carrinho
      const shoppingCart = new ShoppingCart({
        userId: user._id,
        items: [{ eventId: event, quantity: parseInt(quantity) }],
        total: parseInt(total) * parseInt(quantity),
      });
      await shoppingCart.save();
    }
    res.redirect("/shopping-cart");
  } catch (err) {
    res.render("error", { message: err.message, error: err });
  }
};

shoppingCartController.removeFromCart = async (req, res) => {
  try {
    const eventId = req.body.eventId;
    const user = await authController.getAuthenticatedUser(req, res);
    const cart = await ShoppingCart.findOne({ userId: user._id });
    const event = await Events.findById(eventId);

    if (cart) {
      // Encontre o índice do item no carrinho com base no eventId
      const itemIndex = cart.items.findIndex((item) =>
        item.eventId.equals(eventId)
      );
      if (itemIndex !== -1) {
        // Se o item for encontrado no carrinho, remova-o
        cart.items.splice(itemIndex, 1);

        // Atualiza o total
        cart.total = 0;
        for (const item of cart.items) {
          const event = await Events.findById(item.eventId);
          cart.total += event.price * item.quantity;
        }
        cart.usagePromo = false;
        await cart.save();
      }
    }
    res.redirect("/shopping-cart");
  } catch (error) {
    res.render("error", { message: error.message, error: error });
  }
};

shoppingCartController.editShoppingCart = async function (req, res) {
  const cartId = req.params.cartId;
  const { itemId, action } = req.body;
  const cart = await ShoppingCart.findById(cartId);
  const max = 0;
  const min = 0;

  try {
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      res.render("error", {
        message: "Item not found in shopping cart",
        error: { status: "", stack: "" },
      });
    }

    // new
    const event = await Events.findById(cart.items[itemIndex].eventId);
    console.log(event);
    if (action === "increase") {
      if (cart.items[itemIndex].quantity < event.totalNumberTickets) {
        cart.items[itemIndex].quantity += 1;
      }
    } else if (action === "decrease") {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      }
    }

    cart.total = 0;
    for (const item of cart.items) {
      const event = await Events.findById(item.eventId);
      cart.total += event.price * item.quantity;
    }
    await cart.save();
    res.redirect("/shopping-cart");
  } catch (err) {
    res.render("error", {
      message: "Error editing cart with id " + cartId,
      error: err,
    });
  }
};

shoppingCartController.addPromoShoppingCart = async function (req, res) {
  const cartId = req.params.cartId;
  const cart = await ShoppingCart.findById(cartId);
  const promoName = req.body.namePromo;
  try {
    if (promoName == "Sem Promo") {
      cart.namePromo = "Sem Promo";
      cart.percentage = 0;
      cart.total += cart.discount;
      cart.usagePromo = false;
    } else {
      const promo = await Promos.find({ namePromo: promoName });
      const discount =
        (parseFloat(cart.total) * parseFloat(promo[0].percentage)) / 100;
      cart.discount = discount;
      cart.total -= discount;
      cart.namePromo = promoName;
      cart.percentage = parseFloat(promo[0].percentage);
      cart.usagePromo = true;
    }
    await cart.save();
    res.redirect("/shopping-cart/payment");
  } catch (err) {
    res.render("error", { message: "Error add promo to cart", error: err });
  }
};

shoppingCartController.renderPayment = async function (req, res) {
  try {
    const events = await Events.find().exec();
    const promos = await Promos.find().exec();
    const user = await authController.getAuthenticatedUser(req, res);
    const cart = await ShoppingCart.findOne({ userId: user._id });

    res.render("shoppingCart/payment", { cart: cart, user, events, promos });
  } catch (err) {
    res.render("error", { message: err.message, error: err });
  }
};

shoppingCartController.confirmPayment = async function (req, res) {
  const cartId = req.params.cartId;
  try {
    const { numeroCartao, cvv } = req.body;
    const user = await authController.getAuthenticatedUser(req, res);
    const cart = await ShoppingCart.findById(cartId);
    const events = await Events.find().exec();
    if (!cart || !user) {
      return res.render("error", {
        message: "Cart or user does not exist",
        error: { status: "", stack: "" },
      });
    }
    console.log("events: " + events);
    if (numeroCartao === "4242424242424242" && cvv === "123") {
      user.points += parseInt(cart.total * 0.5);
      await user.save();
      for (let i = 0; i < cart.items.length; i++) {
        const event = await Events.findById(cart.items[i].eventId);
        event.totalNumberTickets -= cart.items[i].quantity;
        await event.save();
        const heritage = await Heritages.findOne({
          name: event.heritageDestiny,
        }).exec();
        heritage.visitCounter += cart.items[i].quantity;
        await heritage.save();
      }
      for (let i = 0; i < user.promosList.length; i++) {
        const idPromoInUser = user.promosList[i].promo._id;
        const promo = await Promos.findById(idPromoInUser);
        if (promo.namePromo == cart.namePromo) {
          user.promosList.splice(i, 1);
          await user.save();
          break;
        }
      }
      const purchaseItems = cart.items.map((item) => {
        const event = events.find((event) => event._id.equals(item.eventId));
        const nameItem = event ? event.name : "Default Item Name";
        const typeItem = event ? event.typeTicket : "Default";
        return {
          quantityItem: item.quantity,
          nameItem: nameItem,
          typeItem: typeItem,
        };
      });
      const purchase = new Purchases({
        userId: user._id,
        items: purchaseItems,
        total: cart.total,
        winningPoints: parseInt(cart.total * 0.5),
      });
      await purchase.save();
      await ShoppingCart.findByIdAndDelete(cart._id);
      return res.redirect("/heritage");
    } else {
      return res.render("error", {
        message:
          "An error occurred while processing your payment. Please try again later.",
        error: { status: "", stack: "" },
      });
    }
  } catch (err) {
    console.log(err);
    return res.render("error", {
      message:
        "An error occurred while processing your payment. Please try again later.",
      error: err,
    });
  }
};

//API
shoppingCartController.showCartAPI = async function (req, res) {
  try {
    const events = await Events.find().exec();
    const promos = await Promos.find().exec();
    const user = await authController.getAuthenticatedUserAPI(req, res);
    const cart = await ShoppingCart.findOne({ userId: user._id });
    res.status(200).json({ message: "OK", data: cart, user, events, promos });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again." });
  }
};

shoppingCartController.addToCartAPI = async function (req, res) {
  try {
    const { event, quantity, total } = req.body;
    const user = await authController.getAuthenticatedUserAPI(req, res);
    const cart = await ShoppingCart.findOne({ userId: user._id });
    const foundEvent = await Events.findById(event);

    if (cart) {
      const itemIndex = cart.items.findIndex((item) =>
        item.eventId.equals(event)
      );
      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity += parseInt(quantity);
        cart.total += parseInt(foundEvent.price) * parseInt(quantity);
      } else {
        const item = {
          eventId: event,
          quantity: parseInt(quantity),
        };
        cart.items.push(item);
        cart.total += parseInt(foundEvent.price) * parseInt(quantity);
      }
      await cart.save();
    } else {
      const shoppingCart = new ShoppingCart({
        userId: user._id,
        items: [{ eventId: event, quantity: parseInt(quantity) }],
        total: parseInt(total) * parseInt(quantity),
      });
      await shoppingCart.save();
    }
    res.status(200).json({ message: "Success adding cart" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again." });
  }
};

shoppingCartController.removeFromCartAPI = async (req, res) => {
  const cartId = req.params.cartId;
  const eventId = req.body.eventId;
  const cart = await ShoppingCart.findById(cartId);
  try {
    const itemIndex = cart.items.findIndex((item) =>
      item.eventId.equals(eventId)
    );
    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
      cart.total = 0;
      for (const item of cart.items) {
        const event = await Events.findById(item.eventId);
        cart.total += event.price * item.quantity;
      }
      cart.usagePromo = false;
      await cart.save();
    }
    res.status(200).json({ message: "Success" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again." });
  }
};

shoppingCartController.editShoppingCartAPI = async function (req, res) {
  const cartId = req.params.cartId;
  const { itemId, action } = req.body;
  const cart = await ShoppingCart.findById(cartId);

  try {
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Item not found in shopping cart" });
    }
    const event = await Events.findById(cart.items[itemIndex].eventId);
    if (action === "increase") {
      if (cart.items[itemIndex].quantity < event.totalNumberTickets) {
        cart.items[itemIndex].quantity += 1;
      }
    } else if (action === "decrease") {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      }
    }
    cart.total = 0;
    for (const item of cart.items) {
      const event = await Events.findById(item.eventId);
      cart.total += event.price * item.quantity;
    }
    await cart.save();
    res.status(200).json({ message: "Success" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again." });
  }
};

shoppingCartController.addPromoShoppingCartAPI = async function (req, res) {
  const cartId = req.params.cartId;
  const cart = await ShoppingCart.findById(cartId);
  const promoName = req.body.namePromo;
  try {
    if (promoName == "Sem Promo") {
      cart.namePromo = "Sem Promo";
      cart.percentage = 0;
      cart.total += cart.discount;
      cart.usagePromo = false;
    } else {
      const promo = await Promos.find({ namePromo: promoName });
      const discount =
        (parseFloat(cart.total) * parseFloat(promo[0].percentage)) / 100;
      cart.discount = discount;
      cart.total -= discount;
      cart.namePromo = promoName;
      cart.percentage = parseFloat(promo[0].percentage);
      cart.usagePromo = true;
    }
    await cart.save();
    res.status(200).json({ message: "Succes" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again." });
  }
};

shoppingCartController.renderPaymentAPI = async function (req, res) {
  try {
    const events = await Events.find().exec();
    const user = await authController.getAuthenticatedUserAPI(req, res);
    const cart = await ShoppingCart.findOne({ userId: user._id });
    const promos = await Promos.find().exec();

    res
      .status(200)
      .json({ message: "Succes", data: cart, user, events, promos });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again." });
  }
};

shoppingCartController.confirmPaymentAPI = async function (req, res) {
  const cartId = req.params.cartId;
  try {
    const { numeroCartao, cvv } = req.body;
    const user = await authController.getAuthenticatedUserAPI(req, res);
    const cart = await ShoppingCart.findById(cartId);
    const events = await Events.find().exec();
    if (!cart || !user) {
      return res.status(404).json({ message: "Cart or user does not exist" });
    }
    if (numeroCartao === "4242424242424242" && cvv === "123") {
      user.points += parseInt(cart.total * 0.5);
      await user.save();
      for (let i = 0; i < cart.items.length; i++) {
        const event = await Events.findById(cart.items[i].eventId);
        event.totalNumberTickets -= cart.items[i].quantity;
        await event.save();
        const heritage = await Heritages.findOne({
          name: event.heritageDestiny,
        }).exec();
        heritage.visitCounter += cart.items[i].quantity;
        await heritage.save();
      }
      for (let i = 0; i < user.promosList.length; i++) {
        const idPromoInUser = user.promosList[i].promo._id;
        const promo = await Promos.findById(idPromoInUser);
        if (promo.namePromo == cart.namePromo) {
          user.promosList.splice(i, 1);
          await user.save();
          break;
        }
      }
      const purchaseItems = cart.items.map((item) => {
        const event = events.find((event) => event._id.equals(item.eventId));
        const nameItem = event ? event.name : "Default Item Name";
        const typeItem = event ? event.typeTicket : "Default";
        return {
          quantityItem: item.quantity,
          nameItem: nameItem,
          typeItem: typeItem,
        };
      });
      const purchase = new Purchases({
        userId: user._id,
        items: purchaseItems,
        total: cart.total,
        winningPoints: parseInt(cart.total * 0.5),
      });
      await purchase.save();
      await ShoppingCart.findByIdAndDelete(cart._id);
      res.status(200).json({ message: "Succes" });
    } else {
      return res
        .status(404)
        .json({ message: "Something went wrong, please try again." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again." });
  }
};

module.exports = shoppingCartController;
