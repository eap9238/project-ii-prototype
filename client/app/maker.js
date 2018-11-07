const handleDomo = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({width:'hide'},350);

  if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
    loadDomosFromServer($("#token").val());
  });

  return false;
};

const handleDelete = (e) => {
  e.preventDefault();
    
  $("#domoMessage").animate({width:'hide'}, 350);
    
  sendAjax('DELETE', $("#deleteDomo").attr("action"), $("#deleteDomo").serialize(), function(){
    loadDomosFromServer($("token").val());
  });
};

const coinForm = () => {
    return (
        <form id="coinForm" name="coinForm" action="/maker" method="GET" className="coinForm">
            <label htmlFor="coin">Coin: </label>
            <input id="domoCoin" type="number" name="coin" placeholder="0" disabled/>
        </form>
    );
};

const DomoForm = (props) => {
  return (
    <form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
        <label htmlFor="name">Name: </label>
        <input id="domoType" type="select" name="name" placeholder="Domo Type"/>
        <label htmlFor="type">Age: </label>
        <input id="domoType" type="number" name="type" placeholder="Domo Type"/>
        //<label htmlFor="level">Level: </label>
        //<input id="domoLevel" type="number" min="1" max="50" name="level" placeholder="Domo Level"/>
        <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
        <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
    </form>
  );
};

const DomoList = function(props) {
  if(props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos yet</h3>
      </div>
    );
  }

  const domoNodes = props.domos.map(function(domo) {
    return (
      <div key={domo._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
        <h3 className="domoName">Name: {domo.name}</h3>
        //<h3 className="domoAge">Age: {domo.age}</h3>
        <h3 className="domoLevel">Level: {domo.level}</h3>
        <form id="levelDomo"
              onSubmit={handleLevel}
              name="levelDomo"
              action="/levelDomo"
              method="LEVEL"
        >
            <input type="hidden" name="_id" value={domo._id}/>
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
            <input className="makeDomoLevel" type="submit" value="Level Up"/>
        </form>
        <form id="deleteDomo"
              onSubmit={handleDelete}
              name="deleteDomo"
              action="/deleteDomo"
              method="DELETE"
        >
            <input type="hidden" name="_id" value={domo._id}/>
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
            <input className="makeDomoDelete" type="submit" value="Sell"/>
        </form>
      </div>
    );
  });

  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const loadDomosFromServer = (csrf) => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} csrf={csrf}/>, document.querySelector("#domos")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );

  ReactDOM.render(
    <DomoList domos={[]} csrf={csrf}/>, document.querySelector("#domos")
  );

  loadDomosFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});