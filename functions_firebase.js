const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
db = admin.firestore();
database = admin.database();
fcm = admin.messaging();


exports.solicitar_servico = functions.https.onRequest(async (req, res) =>{ 

    acao = req.body.acao;

    if(acao === 'consultar'){
        email = req.body.email;    

        consulta = await db.collection('atendimento').where("email", "==", email).get().then(snapshot=>{        
           return snapshot;
        });
        solicitacao = [];
        consulta.forEach((doc) =>{
            solic = doc.data();
            solic.id = doc.id;
            solicitacao.push(solic);        
        });
        servico = solicitacao[0];        
        res.json(servico);


    }else if(acao === 'solicitar'){
        servico = req.body.servico;
        forma_pagamento = req.body.forma_pagamento;
        email = req.body.email;
        servico = {servico: servico, status: 'Em andamento', forma_pagamento: forma_pagamento, email:email};
        consulta = await db.collection('atendimento').where("email", "==", email).get().then(snapshot=>{        
            return snapshot;
         });
         solicitacao = [];
         consulta.forEach((doc) =>{
             solic = doc.data();
             solic.id = doc.id;
             solicitacao.push(solic);        
         });

         if(solicitacao.length > 0){
            servico =  solicitacao[0];
            res.json(servico);
         }else{
            
            const atendimento = await db.collection('atendimento').add(servico);
            
            res.json({id: atendimento.id});
         }     
   

    }       
});