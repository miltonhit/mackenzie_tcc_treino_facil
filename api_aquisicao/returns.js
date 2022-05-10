module.exports = {
    success: function(callback, obj) {
        callback(null, obj);
    },
    
    logic: function(callback, obj) {
        callback(null, obj);
    },
    
    fatal: function(callback, obj) {
        var jsonErr = JSON.stringify(obj, null, 2);
        console.error("Fatal Error", jsonErr);
        callback(jsonErr);
    },
    
    logicalErrors: {
        semCelularCadastradoParaRedefinirSenha: {id: 97, message: "OPS... Não será possível realizar esse processo... Favor entrar em contato com o nosso Atendimento.", notify: "error-pop-up"},
        cpfNaoCadastrado: {id: 98, message: "OPS... Não encontrado seu CPF em nossa base de dados, faça nosso cadastro :)", notify: "error-pop-up"},
        usuarioSenhaInvalido: {id: 99, message: "Usuário e/ou senha inválido(s)... Tente novamente.", notify: "error-pop-up"},
        cpfCadastrado: {id: 100, message: "CPF já está cadastrado em nossa base... Faça o login :)", notify: "error-pop-up"},
        emailCadastrado: {id: 101, message: "Email já está cadastrado em nossa base... Faça o login :)", notify: "error-pop-up"},
        tokenEnviadoSMS: {id: 102, message: "Acabamos de enviar o token via SMS para você :)", notify: "error-pop-up"},
        tokenPrecisaSerInformado: {id: 103, message: "Token inválido... Tente novamente.", notify: "error-pop-up"}
    }
};