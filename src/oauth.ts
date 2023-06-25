/* Import dependencies */
import Express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

/* Import Config */
import { client_id, client_secret, port } from "./config.js";
import { fileURLToPath } from 'url';

/* Define app variables */
const app = Express();
const __dirname = fileURLToPath(import.meta.url).split("/").slice(0, -2).join("/");

/* Configure the app */
app.use(Express.urlencoded({ extended: false }));
app.use(Express.json());
app.use(bodyParser.text());

/* Handle GET Requests */
app.use("/", Express.static(__dirname + "/public", ))

/* Handle POST Requests */
app.post('/user', async (req, res) => {
  const { data } = await axios.post('https://discord.com/api/oauth2/token', {
    params: {
      client_id: client_id,
      client_secret: client_secret,
      grant_type: 'authorization_code',
      redirect_uri: `https://127.0.0.1/Oauth`,
      scope: 'identify',
      code: req.body,
    }
  }).catch(e => {
    console.error(e);
    return {data: null}
  })

  if (!data) return res.sendStatus(500) 
  const response = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      "authorization": `Bearer ${data.access_token}`
    }
  }).catch(err => {
    console.log(err);
    res.sendStatus(500);
  });

  if (response) res.status(200).send(response.data.username);
});

/* Start "Listening" */
app.listen(port, () => {
  console.log(`App listening! Link: http://localhost:${port}/`);
});
