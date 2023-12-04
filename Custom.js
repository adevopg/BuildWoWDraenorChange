const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = 'Wow-64.exe';
const targetAddress = 0x00A1FE90; // World of Draenor 6.2.3 20779 Win64

rl.question('Introduce la build del juego: ', (inputBuild) => {
  const buildNumber = parseInt(inputBuild); 
  if (isNaN(buildNumber)) {
    console.error('Entrada no válida. Se espera un número.');
    rl.close();
    return;
  }

  const buildBytes = Buffer.alloc(2); 
  buildBytes.writeUInt16LE(buildNumber, 0); 

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      rl.close();
      return;
    }

    
    const offset = targetAddress;
    if (offset < 0 || offset + buildBytes.length > data.length) {
      console.error('Dirección de memoria fuera de rango');
      rl.close();
      return;
    }

    
    buildBytes.copy(data, offset);

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error('Error al escribir en el archivo:', err);
        rl.close();
        return;
      }
      console.log('Bytes modificados exitosamente en la dirección de memoria:', targetAddress);
      rl.close();
    });
  });
});
