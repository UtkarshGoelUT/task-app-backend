const express = require('express');
const { update } = require('../models/user');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }

    // Using promise
    // user.save()
    //     .then(() => {
    //         res.status(201).send(user);
    //     })
    //     .catch((e) => {
    //         res.status(400).send(e);
    //     });
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send()
        }
    } catch (e) {
        res.status(500).send();
    }


    // Using promises
    // User.findById(_id)
    //     .then((user) => {
    //         if (!user) {
    //             return res.status(404).send();
    //         }
    //         res.send(user);
    //     })
    //     .catch((err) => {
    //         res.status(500).send();
    //     });
});

router.patch('/users/:id', async (req, res) => {
    const _id = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        return res.status(404).send({ error: 'Invalid updates!' });
    }

    try {
        const user = await User.findById(_id);
        updates.forEach((update) => user[update] = req.body[update]);
        user.save();
        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send()
        }
        res.send(user);
    } catch (e) {
        res.status(400).send();
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
});


module.exports = router;