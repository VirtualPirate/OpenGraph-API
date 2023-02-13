# OPEN GRAPH API

This is a Open Graph API. You can `fetch` Open Graph Data of any website from this API

#### `GET` /

This is the end point where we request for Open Graph Information.

### URL Query parameters

| Parameter | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| url       | Should contain the url of the website whose Open Graph info we need to fetch |

## NodeJS example with axios

```javascript
import axios from "axios";

const API_URL = "http://localhost:3000/";
const url = "https://www.stackoverflow.com";

try {
  const response = await axios.get(API_URL, {
    params: {
      url: url,
    },
  });

  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

### Output:

```json
{
  "ogSiteName": "Stack Overflow",
  "ogTitle": "Stack Overflow - Where Developers Learn, Share, & Build Careers",
  "ogUrl": "https://stackoverflow.com",
  "ogDescription": "Stack Overflow | The World’s Largest Online Community for Developers",
  "ogImage": "https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded"
}
```
