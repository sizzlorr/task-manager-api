const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendByeEmail } = require('../emails/account');


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, next) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
            return next(new Error('File should be a Image Type'))
        }

        next(undefined, true);
    }
});

router.post('/users', async (req, res)=> {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
   try {
       const user = await User.getByCredentials(req.body.email, req.body.password);
       const token = await user.generateAuthToken();
       res.send({ user: user, token });
   } catch (e) {
       res.status(400).send(e);
   }
});

router.post('/users/logout', auth, async (req, res) => {
   try {
       req.user.tokens = req.user.tokens.filter((token) => {
          return token.token !== req.token;
       });
       await req.user.save();

       res.status(200).send();
   } catch (e) {
       res.status(500).send(e);
   }
});

router.post('/users/logout/all', auth, async (req, res) => {
   try {
       req.user.tokens = [];
       await req.user.save();

       res.status(200).send();
   } catch (e) {
       res.status(500).send(e);
   }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250 }).png().toBuffer();
    req.user.avatar = buffer;

    await req.user.save();

    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/users/me/avatar', auth, (req, res) => {
    try {
        // const user = await User.findById(req.params.id);
        if (!req.user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(req.user.avatar);
    } catch (e) {
        res.status(404).send(e);
    }
});

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//
//     try {
//         const user = await User.findById(_id);
//         if(!user) {
//             return res.status(404).send('No User found');
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'password', 'email', 'age'];
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValid) {
        return res.status(400).send('Invalid Updates');
    }

    try {
        updates.forEach((update) => {
           req.user[update] = req.body[update];
        });
        await req.user.save();

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const _id = req.user._id;
        // const user = await User.findByIdAndDelete(_id);
        // if (!user) {
        //     res.status(404).send('No User found');
        // }
        await req.user.remove();
        sendByeEmail(req.user.email, req.user.name);

        res.send(req.user);
    } catch (e) {
        res.status(401).send(e);
    }
});

router.delete('/users/me/avatar', auth, async (req, res) => {
   if (!req.user.avatar) {
       res.send(400).send('No User Avatar to delete');
   }
   req.user.avatar = undefined;
   await req.user.save();

   res.send();
});

module.exports = router;
