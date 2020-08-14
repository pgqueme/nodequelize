const jwt = require('jsonwebtoken');
const values = require('./routes/values');
const Usuario = require('./controllers/Usuario');
const logger = require('./utils').logger;
const permisos = {
    ADMINISTRADOR: 'Administrador',
    CUALQUIERA: null,
}
const forceAllow = false;

module.exports = {
    validarTokenPermisos(permisos) {
        return function (req, res, next) {
            return validarToken(req, res, next, permisos);
        }
    },

    permisos,
    autorizarToken,
};

function validarToken(req, res, next, permisos) {
    try {
        logger.info('------------------------------------------------------------');
        if(req) logger.info(req.originalUrl);

        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            // Obtener el token del header de autorización. Tiene el formato: Bearer <token>
            const token = req.headers.authorization.split(' ')[1];
            // Validar el token
            var result = jwt.verify(token, values.secret);
            // Autorizar el token
            var permisoValido = false;
            permisos.forEach(permiso => {
                permisoValido = permisoValido || autorizarToken(result, permiso);
            });
            if(forceAllow || permisoValido) {
                req.decoded = result;
                var tokenData = extractTokenData(result);
                if(!tokenData) throw new Error('403');
                req.tokenData = tokenData;
                next();
            }
            else {
                // Acción prohibida, no cuenta con los permisos necesarios.
                throw new Error('403');
            }
        }
        else {
            // No incluyó token en su request
            throw new Error('401');
        }
    }
    catch(err) {
        switch(err.message) {
            case '403': {
                logger.error('Token con permisos insuficientes');
                result = {
                    error: true,
                    message: 'No cuenta con los permisos suficientes para realizar esta acción.',
                    status: 403
                };
                return res.status(403).send(result);
            }
            case '401':
            default: {
                logger.error('Token no incluido o inválido');
                result = {
                    error: true,
                    message: 'Error de autenticación. Por favor inicie sesión nuevamente.',
                    status: 401
                };
                return res.status(401).send(result);
            }
        }
    }
}

function autorizarToken(token, permiso) {
    // Validar datos
    if(!token || !token.Rol) return false;
    
    var usuario = token;
    var rol = usuario.Rol;
    
    if(!permiso) return true;

    // Validación con permisos de usuario 
    var permisosRol = rol.permisos;
    var permisosAdicionalesUsuario = usuario.permisos;
    var permisosBloqueadosUsuario = usuario.bloqueos;
    
    // Permiso bloqueado
    if(permisosBloqueadosUsuario && permisosBloqueadosUsuario.indexOf(permiso) != -1) return false;
    // Permiso permitido
    if(permisosRol && permisosRol.indexOf(permiso) != -1) return true;
    if(permisosAdicionalesUsuario && permisosAdicionalesUsuario.indexOf(permiso) != -1) return true;
    
    return false;
}

function extractTokenData(token) {
    if(!token || !token.Rol) return null;
    
    var tokenData = {
        UsuarioId: token.id,
        RolId: token.RolId,
    };

    return tokenData;
}