const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const getISTDateTime = require("./ServerTime");
const db=require("./mysql");
const emailSender = require('./email');
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))

//Admin user Block and unblock settings
app.patch("/api/account_management", (req, res) => {
   let data=req.body;
  const query = "update user_details set status=? where email=?";
  db.execute(query,[data.requestType,data.email], (err, result) => {
    if (err) {
      console.error('Error executing database query:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
    else if (result.affectedRows > 0) {
      res.status(200).send({ message: 'User status updated successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
})

//Admin page details
app.get("/api/admin", (req, res) => {
  const query = "select a.email ,a.status,sum(b.net_amount) amount from user_details as a left join payment_details as b on a.email=b.email group by a.email";
  db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: 'Internal Server Error' });
    }
    else{
    res.status(200).send(result);
    }
  })
})

//fetch data to display modification page
app.get("/api/fetch_modifyDetails", (req, res) => {
  const query = "select * from food_details";
  db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.send(result);
  })
})

//send food_details to frontend
app.post("/api/fetch_food_details", (req, res) => {
  let data = req.body;
  let { date, time } = getISTDateTime();
  const query = "select * from food_details where Category=?";
  db.query(query, [data.Category], (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      let dataResult = {
        result, serverDate: date, serverTime: time
      }
      res.send(dataResult);
    }
  })
})

//delete the item
app.delete("/api/delete_foodItem:id", (req, res) => {
  const data = req.params.id;
  console.log("jsbs"+data);
  const query = "delete from food_details where item_name=?";
  db.query(query, [data], (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      console.log(result);
      res.send(result);
    }
  });

})
// Modify the existing data of food from db
app.patch("/api/modify_food_details_WithoutImg", (req, res) => {
  const data = req.body;
  const query = "update food_details set item_name=?,price=?,category=?,from_time=?,to_time=? where item_name=?";
  db.query(query, [data.itemName, data.price, data.category, data.fromTime, data.toTime, data.oldName], (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.send(result);
  })

})

app.post("/api/modify_food_details_withImage", (req, res) => {
  const data = req.body;
  console.log(data);
  const query = "update food_details set item_name=?,price=?,category=?,from_time=?,to_time=?,file_path=? where item_name=?";
  db.query(query, [data.itemName, data.price, data.category, data.fromTime, data.toTime, data.file_path, data.oldName], (err, result) => {
    if (err) {
      res.send(err);
      console.log(err);
    }
    else {
      let message = { updated: true };
      res.send(message);
    }
  })



})

//storing  values of food to database
app.post('/api/upload_foodcontainer', (req, res) => {
  let { date, time } = getISTDateTime();
  const data = req.body;
  const query = "insert into food_details (item_name,price,category,from_time,to_time,file_path,added_date,added_time)  values (?,?,?,?,?,?,?,?)";
  db.query(query, [data.addItemItemName, data.addItemPrice, data.addItemFoodType, data.fromTime, data.toTime, data.file_path, date, time], (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    console.log(result);
    res.send(result);
  })
});

//Fetching itemName from food_container table
app.post("/api/foodContainer_ItemName", (req, res) => {
  let data = req.body;
  const query = "select * from food_details where item_name=?";
  let message = {};
  const max = "select max(id) as max from food_details ";
  db.query(max, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else{
      message.id = result[0].max;
    }
  })

  db.query(query, [data.itemName], (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      message.length = result.length;
      // console.log("message from kavin" + JSON.stringify(message));
      res.send(message);
    }
  })


})

app.post("/api/fetchHistoryDetails", (req, res) => {
  let data = req.body;
  let query = "";
  let wholeData = {
    itemDetails: "",
    paymentDetails: ""
  };
  jwt.verify(data.id, "jwtSecretKey", (err, decoded) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      let email = decoded.id;
      query = "select * from ordered_items where email=? order by token desc";
      db.query(query, [email], (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        else {
          wholeData.itemDetails = result;
          query = "select * from payment_details where email=? order by token desc"
          db.query(query, [email], (err, result) => {
            if (err) {
              console.log(err);
              res.send(err);
            }
            else {
              wholeData.paymentDetails = result;
              res.send(wholeData);
            }
          })
        }
      })

    }
  })
})
//getting maximun token value from db
app.post("/api/fetchMaxToken", (req, res) => {
  jwt.verify(req.body.id, "jwtSecretKey", (err, decoded) => {
    if (err) {
      res.send(err);
    }
    else {
      let email = decoded.id;
      const query = "select max(token) as max from  payment_details where email= ? ";
      db.query(query, [email], (err, result) => {
        if (err)
          res.send(err);
        else {
          let data = {
            email,
            token: result
          }
          res.send(data);
        }
      })

    }
  })
})

//updating all the ordered food records in db
app.post("/api/orderedItemDetails", (req, res) => {
  const query = `insert into  ordered_items(email, token, item_Name, quantity, price, total_price)  values${req.body.orderListValues}`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err)
    }
    else
      res.send(result);
  })
})

//updating paymentdetails of successfull payment in db
app.post("/api/paymentDetails", (req, res) => {
  let { date, time } = getISTDateTime();
  let data = req.body;
  jwt.verify(data.id, "jwtSecretKey", (err, decoded) => {
    if (err) {
      console.error('Error decoding JWT:', err);
      res.status(401).send('Unauthorized');
    }
    else {
      let email = decoded.id;
      const query = "insert into  payment_details(email, token, net_amount, payment_id, date, time, status) values(?,?,?,?,?,?,?)";
      db.query(query, [email, data.token, data.netAmountBackend, data.payment_id, date, time, data.payment_status], (err, result) => {
        if (err) {
          console.log(err);
          res.send(err)
        }
        else
          res.send(result);
      })
    }
  })

})

app.post('/api/update', (req, res) => {
  let data = req.body;
  const update = "update  user_details set password=? where email=?";
  db.query(update, [data.passwordName, data.emailName], (error, results) => {
    if (error) {
      res.send("Error Occured in Server Side")
      console.log(error);
    }
    res.send(results);
  })

})
app.post("/foodPageAuthentication", (req, res) => {
  const data = req.body;
  jwt.verify(data.token, "jwtSecretKey", (err, decoded) => {
    if (err) {
      console.log("kavinerroe"+err);
      const verify = { auth: false };
      res.send(verify);
    }
    else {
      let email = decoded.id;
      const query = "select email,payment_pin from user_details where email=?";
      db.query(query, [email], (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        else {
          if (result.length >= 1) {
             if(result[0].payment_pin===null)
             {
              const verify = { auth: true,pin:null,email};
              res.send(verify);
             }
             else{
            const verify = { auth: true,pin:"ok",email};
            res.send(verify);
             }
          }
          else {
            res.send({ auth: false })
          }
        }
      })

    }
  }
  )
})


app.post("/api/fetch_login_details", (req, res) => {
  const loginEmail = req.body.loginEmail;
  const loginPassword = req.body.loginPassword;

  const check = "select * from user_details where email=?";
  db.query(check, [loginEmail,loginPassword], (error, results) => {
    if (error) {
      console.log(error);
      res.send("Error Occured in Server Side");
    }
    else {

      if (results.length >= 1) {
        let responseData = { };
        if(results[0].email===loginEmail && results[0].password===loginPassword)
        {
          responseData.emailAuth=true;
          responseData.passAuth=true;

        const id = results[0].email;
        const key = "jwtSecretKey";
        const token = jwt.sign({ id }, key, { expiresIn: '1d' });

        responseData.token=token;
        responseData.access=results[0].status==="Active"?true:false;
        res.send(responseData);
        }
        else{
          let responseData = { emailAuth:true,passAuth:false};
          res.send(responseData);
        }
      }
      else {
        let responseData = { emailAuth: false }
        res.send(responseData);
      }
    }
  })
})
app.post('/api/profile_password_authentication', (req, res) => {
  let data = req.body;
  const check = "select email,password from user_details where email=? and password=?";
  db.query(check, [data.loginEmail, data.loginPassword], (error, results) => {
    if (error) {
      console.log(error);
      res.send({ auth: false });
    }
    else {
      if (results.length >= 1) {
        res.send({ auth: true });
      }
      else {
        res.send({ auth: false });
      }
    }
  })
})
app.post("/api/update_payment_pin", (req, res) => {
  let data = req.body;
  const insert = "update user_details set payment_pin=? where email=?";
  db.query(insert, [data.pin, data.loginEmail], (error, results) => {
    if (error) {
      console.log(error);
      res.send({ auth: false });
    }
    else {
      res.send({ auth: true, results });
    }
  }
  )
})
app.post("/api/verify_payment_pin", (req, res) => {
  let data = req.body;

  const insert = "select email from user_details where email=? and payment_pin=?";
  db.query(insert, [data.email, data.pin], (error, results) => {
    if (error) {
      console.log(error);
      res.send({ auth: false });
    }
    else {
      if (results.length === 1) {
        res.send({ auth: true, results });
      }
      else {
        res.send({ auth: false });
      }
    }
  }
  )
})

app.post('/api/registerData', (req, res) => {
  let { date, time } = getISTDateTime();
  let data = req.body;
  const insert = "insert into user_details(email,password,date,time,status) values(?,?,?,?,?)";
  db.query(insert, [data.emailName, data.pass, date, time,'Active'], (error, results) => {
    if (error) {
      console.log(error);
      res.send("Error Occured in Server Side");
    }
    else {
      res.send(results);
    }
  }
  )
})

app.post("/api/isExistEmail", (req, res) => {
  const query = "select email from user_details where email=?";
  db.query(query, [req.body.emailName], (err, result) => {
    if (err)
    {
      console.log(err);
      res.send(err);
    }
    else
      res.send(result);
  })
})
app.post("/api/emailAuthentication", (req, res) => {
  const data = req.body;
  jwt.verify(data.token, "jwtSecretKey", (err, decoded) => {
    if (err) {
      const verify = { auth: false };
      console.log(err);
      res.send(verify);
    }
    else {
      let email = decoded.id;
      const query = "select email from user_details where email=?";
      db.query(query, [email], (err, result) => {
        if (err)
        {
          console.log(err);
          res.send(err);
        }
        else {
          if (result.length >= 1) {
            const verify = { auth: true };
            res.send(verify);
          }
          else {
            res.send({ auth: false })
          }
        }
      })

    }
  }
  )
})

app.post('/api/sendEmail', (req, res) => {
  res.send('Yes, I got');
  const data = req.body;
  emailSender.sendEmail(data);
});
app.listen(8000, () => {
  console.log("helloworld 8000");
})
