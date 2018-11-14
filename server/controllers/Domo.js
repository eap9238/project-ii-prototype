const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

//create domo
const makeDomo = (req, res) => {
  if (!req.body.title || !req.body.body) {
    return res.status(400).json({ error: 'RAWR! Both title and contents are required' });
  }

    //set internal data
  const domoData = {
    title: req.body.title,
    body: req.body.body,
    owner: req.session.account._id,
    colour: req.body.colour,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

// getDomos()
const getDomos = (request, response) => {
  const req = request;
  const res = response;

    // Actually getting the Domos
  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  });
};

//delete the g-d-nm domo
//why won't you just die?
//please?
const deleteDomo = (request, response) => {
  const req = request;
  const res = response;
  console.log(req.body);

  //find the domo that needs killing
  return Domo.DomoModel.removeByID(req.body._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.status(204).json();
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.deleteDomo = deleteDomo;