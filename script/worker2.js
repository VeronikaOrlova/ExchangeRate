function getData(id, dataStart, dataEnd){
    fetch(`https://www.nbrb.by/api/exrates/rates/dynamics/${id}?startdate=${dataStart}&enddate=${dataEnd}`)
    .then(response => response.json())
    .then(postMessage)
    
}

function sendData({data}) {
    getData(data.id, data.dataStart, data.dataEnd);
}

addEventListener('message', sendData);




