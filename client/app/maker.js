const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({
        width: 'hide'
    }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    return false;
};

const DomoForm = (props) => {
    return ( 
    <form id="domoForm" 
        name="domoForm" 
        onSubmit={handleDomo} 
        action="/maker" 
        method="POST" 
        className="domoForm"
    >
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/> 
        <label htmlFor="pass">Age: </label>
        <input id="domoAge" type="number" name="age" placeholder="0"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="makeDomoSubmit" type="submit" value="Make Domo"/>      
    </form >
    );
};

const DomoList=function(props){
    if(props.domos.length===0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    };


    const domoNodes=prosp.domos.map(function(domo){
        return(
            <div key={domo._id} className="domo">
                <img src="hosted/img/domoface.jpg" alt="domo face" className="domoface" />
                <h3 className="domoName">Name: {domo.name} </h3>
                <h3 className="domoAgee">Age: {domo.age} </h3>
            </div>
        );
    });

    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFormServer=()=>{
    sendAjax('GET','/getDomos',null,(data)=>{
        ReactDom.render(
            <DomoList domos={data.domos} />,document.querySelector("#domos")
        );
    });
};

const setup=function(csrf){
    ReactDom.render(
        <DomoForm csrf={csrf} />,document.querySelector("#makeDomo")
    );
    ReactDOM.render(
        <DomoList domos={[]} />,document.querySelector("#domos")
    );

    loadDomosFromServer();
};

const getToken=()=>{
    sendAjax('GET','/getToken',null,(result)=>{
        setup(result.csrfToken);
    });
};