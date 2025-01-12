const Cart = require('../models/Cart')
const cartController = {}

cartController.create = (req, res) => {
    const {userId, productId, quantity, price} = req.body
    Cart.findOne({userId, isDelete: false})
    .then((cart) => {
        if(cart){
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)

            if(itemIndex > -1){
                cart.items[itemIndex].quantity += quantity
                cart.items[itemIndex].price += price
            } else {
                cart.items.push({productId, quantity, price})
            }
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
            return cart.save()
        } else {
            const newCart = new Cart({
                userId,
                items: [{productId, quantity, price}],
                totalPrice: quantity * price
            })
            return newCart.save()
        }
    })
    .then((cart) => {res.json('New Cart added ', cart)})
    .catch((error) => {res.json(error.message)})
}

cartController.listItems = (req, res) => {
    const userId = req.params.id

    Cart.findOne({userId, isDelete: false})
    .populate('items.productId', '-isDelete')
    .then((cart) => {
        if(!cart){
            return res.json('Cart not found')
        }
        res.json(cart)
    })
    .catch((error) => {res.json(error.message)})
}

cartController.update = (req, res) => {
    const userId = req.params.id
    const { productId, quantity, price } = req.body
    Cart.findOne({userId, isDelete: false})
    .then((cart) => {
        if(!cart){
            return res.json('Cart not found')
        }
        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)
        if(itemIndex > -1){
            if(quantity !== undefined){
                cart.items[itemIndex].quantity = quantity
            }
            if(price !== undefined){
                cart.items[itemIndex].price = price
            }
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
            return cart.save()
        } else {
            res.json('Item not found in cart')
        }
    })
    .then((cart) => {res.json('Cart updated ', 'cart')})
    .catch((error) => {res.json('Error updating cart ', error.message)})
}

cartController.removeFromCart = (req, res) => {
    const userId = req.params.id
    const { productId } = req.body

    Cart.findOne({ userId, isDelete: false })
        .then((cart) => {
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' })
            }

            cart.items = cart.items.filter(
                (item) => item.productId.toString() !== productId
            )

            cart.totalPrice = cart.items.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
            )

            return cart.save()
        })
        .then((updatedCart) => res.json(updatedCart))
        .catch((err) => res.status(500).json({ error: err.message }))
}

cartController.clearCart = (req, res) => {
    const userId = req.params.id

    Cart.findOneAndUpdate(
        { userId, isDelete: false },
        { items: [], totalPrice: 0 },
        { new: true }
    )
        .then((clearedCart) => {
            if (!clearedCart) {
                return res.status(404).json({ message: 'Cart not found' })
            }
            res.json(clearedCart)
        })
        .catch((err) => res.status(500).json({ error: err.message }))
}



module.exports = cartController