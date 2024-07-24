const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const port = 4000;

//create server
const app = express();

//middleware
app.use(bodyParser.json());

//function test(req, res){ แบบเก่า ไม่ค่อยได้ใช้

//}

app.get("/", (req, res) => {
  res.send("<h1>Welcome, This is a Webhook for Line Chatbot</h1>");
});
app.post("/webhook", (req, res) => {
  //create webhook client
  const agent = new WebhookClient({
    request: req,
    response: res,
  });
  console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(req.body));
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function bodyMassIndex(agent) {
    let weight = agent.parameters.weight;
    let height = agent.parameters.height / 100;
    let bmi = (weight / (height * height)).toFixed(2);

    let res = "ขออภัย หนูไม่เข้าใจ";

    if (bmi < 18.5) {
      res = "คุณผอมไป กินข้าวบ้างนะ";
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      res = "คุณหุ่นดีจุงเบย";
    } else if (bmi >= 23 && bmi <= 24.9) {
      res = "คุณเริ่มจะท้วมแล้วนะ";
    } else if ((bmi >= 25.8) & (bmi <= 29.9)) {
      res = "คุณอ้วนละ ออกกำลังกายหน่อยนะ";
    } else if (bmi > 30) {
      res = "คุณอ้วนเกินไปละ หาหมอเหอะ";
    }
    const flexMessage = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://developers-resource.landpress.line.me/fx/img/01_2_restaurant.png",
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover",
          action: {
            type: "uri",
            uri: "https://line.me/",
          },
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          action: {
            type: "uri",
            uri: "https://line.me/",
          },
          contents: [
            {
              type: "text",
              text: "Brown's Burger",
              size: "xl",
              weight: "bold",
            },
            {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  contents: [
                    {
                      type: "icon",
                      url: "https://developers-resource.landpress.line.me/fx/img/restaurant_regular_32.png",
                    },
                    {
                      type: "text",
                      text: "$10.5",
                      weight: "bold",
                      margin: "sm",
                    },
                    {
                      type: "text",
                      text: "400kcl",
                      size: "sm",
                      align: "end",
                      color: "#aaaaaa",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  contents: [
                    {
                      type: "icon",
                      url: "https://developers-resource.landpress.line.me/fx/img/restaurant_large_32.png",
                    },
                    {
                      type: "text",
                      text: "$15.5",
                      weight: "bold",
                      margin: "sm",
                    },
                    {
                      type: "text",
                      text: "550kcl",
                      size: "sm",
                      align: "end",
                      color: "#aaaaaa",
                    },
                  ],
                },
              ],
            },
            {
              type: "text",
              text: "Sauce, Onions, Pickles, Lettuce & Cheese",
              wrap: true,
              color: "#aaaaaa",
              size: "xxs",
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#905c44",
              margin: "xxl",
              action: {
                type: "uri",
                label: "Add to Cart",
                uri: "https://line.me/",
              },
            },
          ],
        },
      },
    };
    //   agent.add(result);
    let payload = new Payload(`LINE`, flexMessage, {
      sendAsMessage: true,
    });
    agent.add(payload);
  }
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);

  intentMap.set("BMI - custom - YES", bodyMassIndex);

  agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log("servier is running at http://localhost:" + port);
});
