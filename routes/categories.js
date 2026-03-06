var express = require('express');
var router = express.Router();
let { categories } = require('../utils/categories');
let { data } = require('../utils/data');
let slugify = require('slugify');
let { IncrementalId } = require('../utils/IncrementalIdHandler');

/* GET categories listing. */
// /api/v1/categories
router.get('/', function (req, res, next) {
    let nameQ = req.query.name ? req.query.name : '';
    let result = categories.filter(function (e) {
        return e.name.toLowerCase().includes(nameQ.toLowerCase());
    });
    res.send(result);
});

// Get by ID
router.get('/:id', function (req, res, next) {
    let result = categories.find(function (e) {
        return e.id == req.params.id;
    });
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({
            message: "ID NOT FOUND"
        });
    }
});

// Get by Slug
router.get('/slug/:slug', function (req, res, next) {
    let slug = req.params.slug;
    let result = categories.find(function (e) {
        return e.slug == slug;
    });
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({
            message: "SLUG NOT FOUND"
        });
    }
});

// Get products by category ID
// /api/v1/categories/{id}/products
router.get('/:id/products', function (req, res, next) {
    let id = req.params.id;
    // Check if category exists first? User didn't specify, but good practice.
    // Logic: return all products having category.id == id
    let result = data.filter(function (e) {
        // Assuming products have category object with id
        return e.category && e.category.id == id;
    });
    res.send(result);
});

// Create category
router.post('/', function (req, res, next) {
    let newObj = {
        id: IncrementalId(categories),
        name: req.body.name,
        slug: slugify(req.body.name, {
            replacement: '-', lower: true, locale: 'vi',
        }),
        image: req.body.image,
        creationAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
    };
    categories.push(newObj);
    res.send(newObj);
});

// Edit category
router.put('/:id', function (req, res, next) {
    let result = categories.find(function (e) {
        return e.id == req.params.id;
    });
    if (result) {
        let body = req.body;
        let keys = Object.keys(body);
        for (const key of keys) {
            if (result[key] !== undefined && key !== 'id' && key !== 'creationAt') {
                result[key] = body[key];
            }
        }
        // Update slug if name changed?
        if (body.name) {
            result.slug = slugify(body.name, {
                replacement: '-', lower: true, locale: 'vi',
            });
        }
        result.updatedAt = new Date(Date.now());
        res.send(result);
    } else {
        res.status(404).send({
            message: "ID NOT FOUND"
        });
    }
});

// Delete category
router.delete('/:id', function (req, res, next) {
    let index = categories.findIndex(function (e) {
        return e.id == req.params.id;
    });
    if (index !== -1) {
        let deletedItem = categories.splice(index, 1)[0];
        res.send(deletedItem);
    } else {
        res.status(404).send({
            message: "ID NOT FOUND"
        });
    }
});

module.exports = router;
