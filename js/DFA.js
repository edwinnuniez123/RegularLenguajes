      var Q = ["q1","q2","q3"];
      var Sigma = ["a","b"];
      var q0 = "q1";
      var F = ["q3"];
      var transiciones = [];
      transiciones.push({ origen:"q1" , destino:"q2" , simbolo:"a" });
      transiciones.push({ origen:"q1" , destino:"q3" , simbolo:"b" });
      transiciones.push({ origen:"q2" , destino:"q2" , simbolo:"a" });
      transiciones.push({ origen:"q2" , destino:"q2" , simbolo:"b" });
      transiciones.push({ origen:"q3" , destino:"q3" , simbolo:"a" });
      transiciones.push({ origen:"q3" , destino:"q3" , simbolo:"b" });

      function submitData() {
        document.getElementsByClassName("formulario")[0].style = "display:none;"
        dibujarDFA();
      }


      var cy;//Cytoscape CORE

     function dibujarDFA() {
       //INICIALIZACIÓN DE CYTOSCAPE
       cy = cytoscape({
         container: document.getElementById('cy'),
         
         boxSelectionEnabled: false,
         autounselectify: true,
         
         style: [
           {
             selector: 'node',
             css: {
               'content': 'data(id)',
               'text-valign': 'center',
               'text-halign': 'center'
             }
           },
           {
             selector: '.root',
             css: {
               'content': 'data(id)',
               'background-color': '#FFFF00'
             }
           },
           {
             selector: '.final',
             css: {
               'content': 'data(id)',
               'background-color': '#DC143C'
             }
           },
           {
             selector: 'edge',
             css: {
               'label': 'data(label)',
               'width': 3,
               'line-color': '#ccc',
               'target-arrow-shape': 'triangle'
             }
           },
           {
             selector: ':selected',
             css: {
               'background-color': 'black',
               'line-color': 'black',
               'target-arrow-color': 'black',
               'source-arrow-color': 'black'
             }
           }
         ],          
        layout: {
           name: 'preset',
           padding: 5
        }
      });
      
      //NODO Q0
      cy.add([
        { group: "nodes", data: { id: q0 }, position: {x: 145, y: 50}, classes: 'root' }
      ]);

      //CREACIÓN DE NODOS
      for (var i = Q.length - 1; i >= 0; i--) {
        if(Q[i] !== q0) {
          if( isFinalState(Q[i],F) ) {
            console.log("Es estado final: " + Q[i]);
            cy.add([
              {group:"nodes", data:{ id : Q[i] } , position: { x: Math.random()*300, y: Math.random()*300 }, classes: 'final' }
            ]);
          } else {
            cy.add([
              {group:"nodes", data:{ id : Q[i] } , position: { x: Math.random()*300, y: Math.random()*300 } }
            ]);  
          }
          
        }
      };
      
      //CREACIÓN DE TRANSICIONES
      for (var i = transiciones.length - 1; i >= 0; i--) {
        var transicionActual = transiciones[i];
        var evaluarTransicion = isDuplicated(transicionActual, transiciones, i);
        console.log(evaluarTransicion);

        if(evaluarTransicion.duplicated) {
          var index = evaluarTransicion.duplicatedIndex;
          var edgeId = transicionActual.origen.concat("-").concat(transicionActual.destino);
          var edgeSigmaSymbol = transicionActual.simbolo.concat(",").concat(transiciones[index].simbolo);
          cy.add({
            group: "edges",
            data: {
              id: edgeId, source: transicionActual.origen, target: transicionActual.destino, label: edgeSigmaSymbol
            }
          });
          transiciones[i].duplicated = true;

        } else if(! transiciones[i].duplicated) {
          var edgeId = transicionActual.origen.concat("-").concat(transicionActual.destino);
          var edgeSigmaSymbol = transicionActual.simbolo;
          cy.add([{
            group: "edges",
            data: {
             id: edgeId, source: transicionActual.origen, target: transicionActual.destino, label: edgeSigmaSymbol 
            }
          }]);
        }
      };
      /*cy.add([{ 
                group: "edges", 
                data: { 
                  id: EdgeId, source: transicionActual.origen, target: transicionActual.destino, label: alphabetSymbol
                }
      }]);*/


        //TODO
      //MOSTRAR DFA
      document.getElementsByClassName("dfaCanvas")[0].style = "display: block;"
     }


     function isDuplicated(transicionActual, transiciones, index) {
      for (var i = index; i >= 0; i--) {
        var bool1 = Boolean(transicionActual.origen === transiciones[i].origen);
        var bool2 = Boolean(transicionActual.destino === transiciones[i].destino);
        var bool3 = Boolean(transicionActual.simbolo !== transiciones[i].simbolo);
        var duplicated = Boolean(bool1 && bool2 && bool3);
        //console.log("Index: "+i+" tIndex: "+index)
        //console.log(transicionActual);
        //console.log(transiciones[i]);
        //console.log("Origen: "+ bool1 +" Destino: "+bool2+" Simbolo: "+bool3+", Duplicated? :"+duplicated);
        if(Boolean(duplicated)) {
          return {duplicated: true, duplicatedIndex: i};
        }
      };
      return {duplicated:false};
     }

     function isFinalState(estado, F) {
      for (var i = F.length - 1; i >= 0; i--) {
        if(estado === F[i]) {
          return true;
        }
      };
      return false
;     }
