import FtpClient from 'ftp';
import Promise from 'bluebird';
import config from '../../config/config';

/**
 * Upload file
 * @return Promise
 */

function upload(source, destination) {
  let client=new FtpClient();
  return new Promise((resolve, reject)=>{
    return connect(client)
      .then(() => {
        return new Promise(function (resolve, reject) {
          client.put(source, destination, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
            client.end();
          });
        });
      })
      .then((list)=> resolve(list))
      .catch((err) => reject(err));
  })
}

function connect(client){
  return new Promise(function(resolve, reject){
    client.connect(config.ftp);
    client.on('ready', function () {
      resolve(client);
    });
    client.on('error', function (err) {
      reject(err);
    });
  });
}
export default { upload }
