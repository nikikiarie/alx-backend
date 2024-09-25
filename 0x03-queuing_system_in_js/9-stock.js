import { createClient } from 'redis';
import express from 'express';
import { promisify } from 'util';

const app = express();

const cli = createClient();

cli.on('connect', function() {
  console.log('Redis client connected to the server');
});

cli.on('error', function (err) {
  console.log(`Redis client not connected to the server: ${err}`);
});

const get = promisify(cli.get).bind(cli);

const elements = [
  { 'itemId': 1, 'itemName': 'Suitcase 250', 'price': 50, 'initialAvailableQuantity': 4},
  { 'itemId': 2, 'itemName': 'Suitcase 450', 'price': 100, 'initialAvailableQuantity': 10},
  { 'itemId': 3, 'itemName': 'Suitcase 650', 'price': 350, 'initialAvailableQuantity': 2},
  { 'itemId': 4, 'itemName': 'Suitcase 1050', 'price': 550, 'initialAvailableQuantity': 5}
];

function getItemById(id) {
  return elements.filter((obj) => obj.itemId === id)[0];
}

function reserveStockById(itemId, stock) {
  cli.set(itemId, stock);
}

async function getCurrentReservedStockById(itemId) {
  const stock = await get(itemId);
  return stock;
}

app.get('/list_products', function (req, res) {
  res.json(elements);
});

app.get('/list_products/:itemId', async function (req, res) {
  const itemId = req.params.itemId;
  const obj = getItemById(parseInt(itemId));

  if (obj) {
    const stock = await getCurrentReservedStockById(itemId);
    const resItem = {
      itemId: obj.itemId,
      itemName: obj.itemName,
      price: obj.price,
      initialAvailableQuantity: obj.initialAvailableQuantity,
      currentQuantity: stock !== null ? parseInt(stock) : obj.initialAvailableQuantity,
    };
    res.json(resItem);
  } else {
    res.json({"status": "Product not found"});
  }
});

app.get('/reserve_product/:itemId', async function (req, res) {
  const itemId = req.params.itemId;
  const obj = getItemById(parseInt(itemId));

  if (!obj) {
    res.json({"status": "Product not found"});
    return;
  }

  let inStock = await getCurrentReservedStockById(itemId);
  if (inStock !== null) {
    inStock = parseInt(inStock);
    if (inStock > 0) {
      reserveStockById(itemId, inStock - 1);
      res.json({"status": "Reservation confirmed", "itemId": itemId});
    } else {
      res.json({"status": "Not enough stock available", "itemId": itemId});
    }
  } else {
    reserveStockById(itemId, obj.initialAvailableQuantity - 1);
    res.json({"status": "Reservation confirmed", "itemId": itemId});
  }
});


const prt = 1245;
app.listen(prt, () => {
  console.log(`app listening at http://localhost:${prt}`);
});
