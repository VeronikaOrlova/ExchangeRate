const selectCur = document.querySelector('.selectCur');

const weekBtn = document.querySelector('.weekBtn');
const monthBtn = document.querySelector('.monthBtn');
const quarterBtn = document.querySelector('.quarterBtn');
const yearBtn = document.querySelector('.yearBtn');

const fromDate = document.querySelector('.fromDate');
const toDate = document.querySelector('.toDate');

const graph = document.getElementById('chart_div');


const today = dayjs().format('YYYY-MM-DD');



function createSelect(argument){     
        argument.forEach(el => {
    
            const option = document.createElement('option');
            option.innerText = el.Cur_Name;
            option.value = el.Cur_ID;
            selectCur.append(option);
        })
}


weekBtn.addEventListener('click', () => getPeriod(-1, `week`));
monthBtn.addEventListener('click', () => getPeriod(-1, `month`))
quarterBtn.addEventListener('click', () => getPeriod(-3, `month`))
yearBtn.addEventListener('click', () => getPeriod(-1, `year`))

selectCur.addEventListener('change', deleteTable)
   
fromDate.addEventListener('change', getDataInp)
toDate.addEventListener('change', getDataInp)
   
   
   
function getDataInp() {
    if(fromDate.value && toDate.value) {
           workDate(selectCur.value, fromDate.value, toDate.value)
    }
}
   
function getPeriod(n, m) {
    const before = dayjs().add(n, m).format('YYYY-MM-DD')
    workDate(selectCur.value, before, today)
}

function deleteTable() {
    const tr = document.querySelectorAll('td');
    tr.forEach(el => el.remove('tr'))
}


selectCur.addEventListener('change', () => {
    deleteTable()
    getCur(allCurrency);
  })

//worker
const worker = new Worker('/script/worker.js');

worker.addEventListener('message', ({data}) => {
      mapping[data.msg](data.payload);
      
  });
  
  let allCurrency;
  
  const mapping = {
      cur: (payload) => {
          allCurrency = payload;
          createSelect(allCurrency);
      }
  }
  
  
function getCur(allCurrency) {
    deleteTable()
    const el = allCurrency.filter((el) => {
          return el.Cur_ID == selectCur.value
          })[0];
    fromDate.min = el.Cur_DateStart.slice(0,10)
    fromDate.max = el.Cur_DateEnd.slice(0,10)
    toDate.min = el.Cur_DateStart.slice(0,10)
    toDate.max = el.Cur_DateEnd.slice(0,10)
    count = el.Cur_QuotName
    workDate(el.Cur_ID, el.Cur_DateStart, el.Cur_DateEnd)
}

let arrayCurs 

const worker2 = new Worker('/script/worker2.js')

function workDate(idCur, start, end) {

    deleteTable()

    worker2.postMessage({
         id: idCur,
         dataStart: start,
         dataEnd: end,
    });
}

worker2.addEventListener('message', ({data}) => {
    getDataWorker({data}.data)
})


function createTable (el1, el2) {

    const tab = document.querySelector('.table');
    const table = document.createElement('table');
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');

    td1.innerText = el1;
    td2.innerText = el2;
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
    tab.appendChild(table);
}



function getDataWorker(el) {
    let rateArray = el;

    rateArray.forEach((json) => {
            createTable(`${json.Date.slice(0,10)}`, ` ${count} ` + ` ${json.Cur_OfficialRate} ` + `BYN`)
            })
    arrayCurs = [];
    rateArray.forEach(el => arrayCurs.push([new Date(el.Date), el.Cur_OfficialRate]))

    createGraph()
}

  
  // функция создания графика
function createGraph() {
      graph.innerHTML = '';
  
      google.charts.load('current', {packages: ['corechart', 'line']});
  
      google.charts.setOnLoadCallback(drawBasic);
  
      function drawBasic() {
          var data = new google.visualization.DataTable();
  
          data.addColumn('datetime', 'X');
          data.addColumn('number', 'Rate');
  
          data.addRows(arrayCurs);
          let options = {
              hAxis: {
                  title: 'Период',
              },
              vAxis: {
                  title: 'Курс'
              },
              width: 1050,
              height: 600,
              chartArea: {
                  top: 20,
                  width: 800,
                  height: 400
              },
              
              };
          if(localStorage.getItem('theme') === 'dark'){
              
              options.hAxis['titleTextStyle'] = {
                  color: 'white'
              }
              options.vAxis['titleTextStyle'] = {
                  color: 'white'
              }
              options.hAxis['textStyle'] = {
                  color: 'white'
              }
              options.vAxis['textStyle'] = {
                  color: 'white'
              }
              options['backgroundColor'] = 'rgb(34, 34, 34)'
          } 
      
          var chart = new google.visualization.LineChart(graph);
          chart.draw(data, options);
      }
}


