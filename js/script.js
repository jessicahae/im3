console.log("Hello, World!");

fetch('https://mmp-im3.jessicahaeseli.ch/php/unload.php')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
