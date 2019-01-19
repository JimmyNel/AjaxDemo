'use-strict'

/* instanciation d'un objet XMLHttpRequest permettant d'envoyer une requête HTTP vers serveur et 
une fois la requête envoyée, les données renvoyées par le serveur peuvent être récupérées. */ 
var xhr = new XMLHttpRequest();

// initie la page par défaut
xhr.onreadystatechange = function () {
    if(xhr.readyState == 4 && xhr.status == 200){
        var jsonReponse = JSON.parse(xhr.responseText);
        afficherDefault(jsonReponse);
    }    
}
xhr.open("GET", "Accueil.json", true);
xhr.send();   

// affiche la page Video Card (à partir d'un fichier Json) au clic sur l'onglet 1
document.getElementById("tab1").onclick = function(){
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            var jsonReponse = JSON.parse(xhr.responseText);
            afficherDefault(jsonReponse);
        }    
    }
    xhr.open("GET", "Accueil.json", true);
    xhr.send();   
};
// affiche la page Presentation (à partir d'un fichier Html) au clic sur l'onglet 2
document.getElementById("tab2").onclick = function(){
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            afficherPresentation();
        }
    }
    xhr.open("GET", "Presentation.html", true);
    xhr.send();    
}
// affiche la page Video Contact (à partir d'un fichier Html) au clic sur l'onglet 3
document.getElementById("tab3").onclick = function(){
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            afficherContact();
        } 
    }
    xhr.open("GET", "Contact.html", true);
    xhr.send();
}

/* active le bouton du formulaire si les class des champs contiennent "has-success" (regex OK)
IMPORTANT = dans HTML utiliser onkeyup et appeler la méthode "regex" avant cette méthode*/
function enableFormButton() {
    let btn = document.getElementById("btn-success-form");
    let divName = document.getElementById("div-name").classList.contains("has-success"); 
    let divEmail = document.getElementById("div-email").classList.contains("has-success"); 
    let divObjet = document.getElementById("div-objet").classList.contains("has-success"); 
    let divMessage = document.getElementById("div-message").classList.contains("has-success"); 
    
    if (divName && divEmail && divObjet && divMessage){       
        btn.disabled = false;
    }
    else
        btn.disabled = true;
}

// active les attributs du Modal (par le biais de fonctions) lorsque les 3 champs obligatoires sont renseignés
function enableModalButton() {
    let email1 = document.getElementById("email1").parentElement.classList.contains("has-success"); 
    let email2 = document.getElementById("email2").parentElement.classList.contains("has-success"); 
    let textareaModal = document.getElementById("textarea-modal").value;     
    
    if (email1 && email2 && textareaModal != ""){       
        TurnOnModalAttribute();
        document.getElementById("form-modal").addEventListener("click", function(event){
        event.preventDefault();
        });
    }
    else
        TurnOffModalAttribute();
}
 
function TurnOnModalAttribute(){
    let x = document.getElementById("send-message-modal");
    x.setAttribute("data-dismiss", "modal");
    x.classList.add("pmd-alert-toggle");
    // Call the jQuery plugin to initialize the Alert while fetching the data dynamically
    $('.pmd-alert-toggle').pmdAlert();
}

function TurnOffModalAttribute(){
    let x = document.getElementById("send-message-modal");
    x.removeAttribute("data-dismiss");
    x.classList.remove("pmd-alert-toggle");
}

// affiche la page Contact à partir d'un fichier HTML
function afficherContact() {
    var contact = xhr.responseText;
    document.getElementById("accueil").innerHTML = "";   
    document.getElementById("contenu").innerHTML = contact;
    document.getElementById("contact-form").addEventListener("click", function(event){
        event.preventDefault();
    });
}
// affiche la page Contact à partir d'un fichier HTML
function afficherPresentation() {
    var presentation = xhr.responseText;
    document.getElementById("accueil").innerHTML = "";
    document.getElementById("contenu").innerHTML = presentation;
}

// affiche la page principale (Card Video) : création de la structure HTML à partir des données Json 
function afficherDefault(JsonRep){      
    var article= ``;

    for (var i = 0; i < JsonRep.length; i++) {
        article += `
        <div class="pmd-card pmd-card-inverse pmd-z-depth" style="width:400px;">
            <div class="pmd-card-media">
                <a href="${JsonRep[i].image}">
                <img width="100%" class="img-responsive" src="${JsonRep[i].image}"></a>
            </div>
            <div class="pmd-card-title">
                <h2 class="pmd-card-title-text">${JsonRep[i].titre}</h2>
                <span class="pmd-card-subtitle-text">${JsonRep[i].auteur}</span>
            </div>
            <div class="pmd-card-body">${JsonRep[i].contenu}</div>
            <div class="pmd-card-actions">
                <button onclick="getLike()" id="btn-like" type="button" data-positionX="right" data-positionY="bottom"  data-duration="6000" data-effect="fadeInUp" data-message="Merci d'avoir aimé cette publication" data-type="information" class="btn btn-sm pmd-btn-fab pmd-btn-flat pmd-ripple-effect btn-primary pmd-alert-toggle"><i class="material-icons pmd-sm">thumb_up</i></button>
                <button id="this-button" onclick="ClearFields()" data-target="#form-dialog" data-toggle="modal" type="button" class="btn btn-sm pmd-btn-fab pmd-btn-flat pmd-ripple-effect btn-primary"><i class="material-icons pmd-sm">drafts</i></button>
                ${modalHtml}
            </div>
        </div>`;
    }
    document.getElementById("contenu").innerHTML = "";
    document.getElementById("accueil").innerHTML = article;
}

// Regex
function regexNom() {
    var exp=new RegExp("^[a-zéèçêîïëœàA-Z0-9 ]{3,20}$","g");
    let x = document.getElementById("name");
    if ( exp.test(x.value) ) {
        document.getElementById("info_nom").innerHTML = '';
        ValidationFormToSuccess(x);
    } else if (!x.value) {
        ValidationFormToClear(x);
    } else {
        document.getElementById("info_nom").innerHTML = '***Le nom doit contenir entre 3 et 20 caractères***';
        ValidationFormToError(x);
    }
}

function regexEmail() {
    var exp=new RegExp("^[a-zA-Z0-9._]+[@]+[a-zA-Z0-9]+[.]+[a-zA-Z]{2,6}","g");
    let x = document.getElementById("email");
    if ( exp.test(x.value) ) {
        document.getElementById("info_email").innerHTML = '';
        ValidationFormToSuccess(x);
    } else if (!x.value) {
        ValidationFormToClear(x);
    } else {
        document.getElementById("info_email").innerHTML = '***Format Email Incorrect***';
        ValidationFormToError(x);
    }
}

function regexEmailModal(ElemName) {   
    var exp=new RegExp("^[a-zA-Z0-9._]+[@]+[a-zA-Z0-9]+[.]+[a-zA-Z]{2,6}","g");
    if ( exp.test(ElemName.value) ) {
        ValidationFormToSuccess(ElemName);
    } 
    else if (!ElemName.value) {
        ValidationFormToClear(ElemName);
    } 
    else {
        ValidationFormToError(ElemName);
    }
}

function regexMessage() {
    var exp=new RegExp("^[a-zéèçêîïëœàA-Z0-9 ]{0,300}$","g");
    let x = document.getElementById("message");
    if ( exp.test(x.value) ) {
        document.getElementById("info_message").innerHTML = ``;
        ValidationFormToSuccess(x);
    } else if (!x.value) {
        ValidationFormToClear(x);
    } else {
        document.getElementById("info_message").innerHTML = `***Le message ne peut contenir plus de 300 caractères*** Nombre Caractères = ${x.value.length}`;
        ValidationFormToError(x);
    }
}

function regexMessageModal() {
    let x = document.getElementById("textarea-modal");
    if (x.value == "")
        ValidationFormToError(x);
    else if (!x.value)
        ValidationFormToClear(x);
    else
        ValidationFormToSuccess(x);
}

function regexObjet() {
    var exp=new RegExp("^[a-zéèçêîïëœàA-Z0-9 ]{5,50}$","g");
    let x = document.getElementById("objet");
    if ( exp.test(x.value) ) {
        document.getElementById("info_objet").innerHTML = '';
        ValidationFormToSuccess(x);
    } else if (!x.value) {
        ValidationFormToClear(x);
    } else {
        document.getElementById("info_objet").innerHTML = '***Le nom doit contenir entre 5 et 49 caractères***';
        ValidationFormToError(x);
    }
}

// mise à jour de la class pour modifier le style des champs du formulaire en fonction du test Regex
function ValidationFormToError(x){
    x.parentElement.classList.remove("has-success");
    x.parentElement.classList.add("has-error");
}
function ValidationFormToSuccess(x){
    x.parentElement.classList.remove("has-error");
    x.parentElement.classList.add("has-success");
}
function ValidationFormToClear(x){
    x.parentElement.classList.remove("has-error");
    x.parentElement.classList.remove("has-success");
}


let modalHtml = `
<div tabindex="-1" class="modal fade" id="form-dialog" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header pmd-modal-bordered">
                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                <h2 class="">Partager avec vos amis !</h2>
            </div>
            <div class="modal-body">
                <form id="form-modal" class="form-horizontal">
                    <div class=" pmd-textfield pmd-textfield-floating-label">
                        <label for="first-name">Votre nom</label>
                        <input type="text" class="mat-input form-control" id="name" value="">
                    </div>
                    <div class="form-group pmd-textfield pmd-textfield-floating-label">
                        <label for="first-name">Votre adresse email</label>
                        <input type="text" class="mat-input form-control" id="email1" onkeyup="regexEmailModal(email1), enableModalButton()" required>
                    </div>
                    <div class=" pmd-textfield pmd-textfield-floating-label">
                        <label for="first-name">Email ami 1</label>
                        <input type="text" class="mat-input form-control" id="email2" value="" onkeyup="regexEmailModal(email2), enableModalButton()" required>
                    </div>
                    <div class=" pmd-textfield pmd-textfield-floating-label">
                        <label for="first-name">Email ami 2</label>
                        <input type="text" class="mat-input form-control" id="email3" onkeyup="regexEmailModal(email3)" value="">
                    </div>
                    <div class=" pmd-textfield pmd-textfield-floating-label">
                        <label for="first-name">Email ami 3</label>
                        <input type="text" class="mat-input form-control" id="email4" onkeyup="regexEmailModal(email4)" value="">
                    </div>
                    <div class="form-group pmd-textfield pmd-textfield-floating-label has-success">
                        <label class="control-label">Message</label>
                        <textarea id="textarea-modal" required class="" autofocus onkeyup="regexMessageModal(), enableModalButton()">Hey, \rj'ai repéré cet article génial sur Video Blog.</textarea>
                    </div>                                 
                    <div class="text-center pmd-modal-action">
                        <input id="send-message-modal" data-positionX="center" data-positionY="top" data-duration="6000" data-effect="fadeInUp" data-message="Votre message a été envoyé avec succès." data-type="success" class="btn pmd-ripple-effect btn-primary" type="submit" value="Envoyer">
                    </div>
                </form>
            </div>   
        </div>
    </div>
</div>`

// ajouter le HTML à la suite du contenu de AfficherDefault
if (document.getElementById("this-button") != null){
    document.getElementById("this-button").innerHTML = modalHtml;
}

// clear Modal's field
function ClearFields(){
    let a = document.getElementById("textarea-modal");
    let b = document.getElementById("email1");
    let c = document.getElementById("email2");
    let d = document.getElementById("email3");
    let e = document.getElementById("email4");
    
    a.value = "Hey, \rj'ai repéré cet article génial sur Video Blog.";
    b.value = "";
    c.value = "";
    d.value = "";
    e.value = "";
    a.parentElement.classList.remove("has-error");
    a.parentElement.classList.add("has-success");
    b.parentElement.classList.remove("has-success", "has-error");
    c.parentElement.classList.remove("has-success", "has-error");
    d.parentElement.classList.remove("has-success", "has-error");
    e.parentElement.classList.remove("has-success", "has-error");
}

// fix bug "Uncaught RangeError: Maximum call stack size exceeded"
setTimeout(() => {
    document.getElementById("textarea-modal").classList.add("form-control")
}, 1000);
