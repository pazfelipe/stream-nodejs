import { createServer } from 'node:http';
import { createReadStream } from "node:fs";
import { Readable, Transform } from "node:stream";
import { WritableStream, TransformStream } from "node:stream/web";
import { setTimeout } from "node:timers/promises";
import csvtojson from "csvtojson";

const PORT = 3000;
createServer(async (request, response) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
  };

  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
    return;
  }

  let items = 0;
  request.on('close', _ => console.info(`Connection closed`, items));

  Readable.toWeb(createReadStream('./file.csv'))
    // step by step until last step
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeThrough(new TransformStream({
      transform(chunk, controller) {
        const data = JSON.parse(Buffer.from(chunk).toString());
        const value = {
          id: data.id,
          fullname: `${data.firstname} ${data.lastname}`,
          email: data.email,
          profession: data.profession,
        };

        // ndjson
        controller.enqueue(JSON.stringify(value).concat("\n"));
      }
    }))
    // last step
    .pipeTo(new WritableStream({
      async write(chunk) {
        await setTimeout(500);
        items++;
        response.write(chunk);
      },
      close() {
        response.end();
      }
    }));

  response.writeHead(200, headers);
})
  .listen(PORT)
  .on('listening', _ => console.log(`Server listening on port ${PORT}`));