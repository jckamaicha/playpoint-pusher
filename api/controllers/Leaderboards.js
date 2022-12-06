const expressAsyncHandler = require("express-async-handler");
const { ObjectId } = require('mongodb');
const { default: mongoose } = require("mongoose");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const Fixture = require("../models/Fixture");
const Leaderboard = require("../models/Leaderboard");
const Prediction = require("../models/Prediction");

module.exports = {
  getLeaderboards: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      leaderboards: await Leaderboard.find(),
    });
  }),
  getLeaderboardsByMarketplaceSlug: expressAsyncHandler(async (req, res) => {
    const data = await Prediction.aggregate([
      {
        $match: {
          marketplaceSlug: sanitizeQueryInput(req.params["marketplaceSlug"]),
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "predictedBy",
          foreignField: "walletID",
          as: "user",
        },
      },
    ]).exec()
    // return data;
    // console.log(data)
    
    const fixtures = await Fixture.find({
      marketplaceSlug: sanitizeQueryInput(req.params["marketplaceSlug"]),
    });

    let leaderboard = [];
    fixtures.map((fixture, key) => {
      let userCount = 0;
      let volume = 0;
      let users = [];
      data.map((prediction) => {
        if (ObjectId(fixture._id).toString() == ObjectId(prediction.fixtureId).toString()) {
          volume += 10;
          users.push({
            name: prediction.user[0].username,
            amount: 10,
          });
          return (userCount += 1);
        }
      });

      users = users.reduce(function (acc, val) {
        var o = acc
          .filter(function (obj) {
            return obj.name == val.name;
          })
          .pop() || { name: val.name, amount: val.amount };

        o.amount += val.amount;
        acc.push(o);
        return acc;
      }, []);

     

    users = users.filter(function(itm, i, a) {
        return i == a.indexOf(itm);
    }).sort((a,b)=>b.amount - a.amount)
      volume = volume+(10*(users.length))
      return leaderboard.push({ fixture, userCount, volume, "topuser":users });
    });

    leaderboard = leaderboard.sort((a, b) => {
      return b.userCount + b.volume - (a.userCount + a.volume);
    });
    res.status(200).json({
      leaderboard,
    });
  }),

  createLeaderboard: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      msg: "Leaderboard created succefully!",
      response: await Leaderboard.create({
        ...req.body,
      }),
    });
  }),

  updateLeaderboard: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      msg: "Leaderboard updated successfully!",
      response: await Leaderboard.updateOne(
        { _id: req.params["leaderboardId"] },
        {
          $set: {
            totalUsers: req.body.totalUsers,
            totalVolume: req.body.totalVolume,
          },
        }
      ),
    });
  }),

  deleteLeaderboard: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      msg: "Leaderboard deleted successfully!",
      response: await Leaderboard.deleteOne({
        _id: req.params["leaderboardId"],
      }),
    });
  }),
};
