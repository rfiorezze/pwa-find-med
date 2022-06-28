var ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);
ajax.send();
ajax.onreadystatechange = function(){

    //Local de destino do conteudo processado
    let content = document.getElementById("content");

    //Esperar requisição acabar e receber 200
    if(this.readyState == 4 && this.status == 200)
    {

        let data_json = JSON.parse(this.responseText);

        if(data_json.length == 0){
            //Quando o WEBSERVICE responder vazio
            content.innerHTML = template_alerta("Não há produtos cadastrados.");
        }else{

            //Processar dados do WEBSERVICE
            let content_html = "";

            for(let i = 0; i < data_json.length; i++){

                content_html += template_categoria(data_json[i].categoria);

                if(data_json[i].produtos.length == 0){
                    content_html += template_alerta("Esta categoria não tem produtos cadastrados.");
                }else{
                    for(let j = 0; j < data_json[i].produtos.length; j++){
                        content_html += template_card(data_json[i].produtos[j].img,data_json[i].produtos[j].nome,data_json[i].produtos[j].descricao,data_json[i].produtos[j].preco,data_json[i].produtos[j].url_comprar);
                    }
                }

            }

            content.innerHTML = content_html;
            cache_dinamico(data_json);
        }

    }

}

//Template Engines

template_alerta = function(mensagem)
{
    return '<div class="row"><div class="col-12"><div class="alert alert-warning" role="alert">'+mensagem+'</div></div></div>';
}

template_categoria = function(nome)
{
    return '<div class="row"><div class="col-12"><h1>Categoria: <strong>'+nome+'</strong></h1></div></div>';
}

template_card = function(img,nome,descricao,preco,url_comprar)
{
    return '<div class="row">'+
                '<div class="col-12">'+              
                    '<div class="card">'+              
                        '<img src="'+img+'" class="img_produto">'+      
                        '<div class="card-body">'+
                        '<h5 class="card-title">'+nome+'</h5>'+               
                        '<p class="card-text">'+descricao+'</p>'+
                        '<div class="row">'+
                            '<div class="btn-toolbar mb-3 area_comprar">'+
                                '<div class="input-group">'+
                                    '<input type="number" placeholder="1" aria-label="1" style="width: 30px; margin-right: 10px;">'+
                                    '<span>R$ '+preco+'</span>'+
                                '</div>'+                            
                                '<div class="btn-group me-2" role="group">'+
                                '<a href="'+url_comprar+'" target="_blank" class="btn btn-warning">Comprar</a>'+
                                '</div>'+                           
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
}

//Cache de Dados Dinâmicos

var cache_dinamico = function(data_json){

    if("caches" in window){

        caches.delete("find_med_dinamico").then(function(){

            if(data_json.length > 0){

                var files = ['dados.json'];

                for(let i = 0; i < data_json.length; i++){
    
                    if(data_json[i].produtos.length > 0){
                    
                        for(let j = 0; j < data_json[i].produtos.length; j++){
                            if(files.indexOf(data_json[i].produtos[j].img) == -1){
                                files.push(data_json[i].produtos[j].img);
                            }                            
                        }
                    }
    
                }

            }
            caches.open("find_med_dinamico").then(function (cache){

                cache.addAll(files).then(function(){
                    console.log("Cache dinâmico adicionado com sucesso!");
                });

            });

        });

    }

}

//Botão de Instalação

let janelaInstalacao = null;

const btInstall = document.getElementById("btInstall");

window.addEventListener('beforeinstallprompt', gravarJanela);

function gravarJanela(evt){
    janelaInstalacao = evt;
}

let inicializarInstalacao = function()
{
    btInstall.removeAttribute("hidden");
    btInstall.addEventListener("click", function(){

        janelaInstalacao.prompt();

        janelaInstalacao.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário fez a instalação");
            }else{
                console.log("Usuário NÃO fez a instalação");
            }

        });

    });
}