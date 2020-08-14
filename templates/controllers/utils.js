var moment = require('moment');
moment.locale('es');
var momentTimezone = require('moment-timezone');
const defaultStart = '1900-01-01';
const defaultFinish = '2500-01-01';
const defaultMin = Number.MIN_SAFE_INTEGER;
const defaultMax = Number.MAX_SAFE_INTEGER;
const defaultTimezone = 'America/Guatemala';
const defaultTimezoneHours = -6;
const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

module.exports = {
    defaultFinish,
    defaultStart,
    defaultTimezone,
    defaultTimezoneHours,
    defaultFormat,

    getSearchOptions(req){
        var options = {};
        options.limit = parseInt(req.query.limit) || 10;
        options.page = parseInt(req.query.page) || 1;
        options.offset = options.limit * (options.page - 1);
        options.orderBy = req.query.orderBy || 'id';
        options.defaultOrder = req.query.orderBy == undefined;
        options.direction = req.query.direction || 'DESC';
        options.field = req.query.field || 'any';
        options.value = this.sanitizeInput(req.query.value) || '';
        options.start = req.query.start || defaultStart;
        options.finish = req.query.finish || defaultFinish;
        options.min = parseFloat(req.query.min) || defaultMin;
        options.max = parseFloat(req.query.max) || defaultMax;
        options.tokenData = req.tokenData;

        options.ids = req.query.ids || [];
        if(options.ids.length > 0){
            options.ids = options.ids.split(',');
        }
        if(req.query.UsuarioId) options.UsuarioId = req.query.UsuarioId;
        return options;
    },

    sanitizeInput(input){
        if(!input || input.trim() == '') return null;
        input = input.replace(/'/g, "");
        input = input.replace(/"/g, "");
        return input;
    },

    convertirFechaATimezone(fecha, formatoSalida, timezone){
        var fechaConvertida = momentTimezone.tz(fecha, timezone);
        return fechaConvertida.format(formatoSalida);
    },

    convertirAUTC(fecha, formato, timezone) {
        var m = momentTimezone.tz(fecha, formato, timezone);
        m.utc();
        var s = m.format(formato);
        return s;
    },

    convertirFecha(fecha, formatoEntrada, formatoSalida) {
        var fecha;
        if(formatoEntrada === 'date') fecha = moment(fecha);
        else fecha = moment(fecha, formatoEntrada);

        var res;
        if(formatoSalida === 'date') res = fecha;
        else res = fecha.format(formatoSalida); 
        return res;
    },

    primerYUltimoDiaDelMes(fecha) {
        var partes = fecha.split('-');
        var y = parseInt(partes[0]);
        var m = parseInt(partes[1]) - 1;
        var firstDay = this.convertirFecha(new Date(y, m, 1), 'date', 'YYYY-MM-DD');
        var lastDay = this.convertirFecha(new Date(y, m + 1, 0), 'date', 'YYYY-MM-DD');

        return { primerDia: firstDay, ultimoDia: lastDay };
    },

    primerYUltimoDiaDelAno(fecha) {
        var partes = fecha.split('-');
        var firstDay = partes[0] + '-01-01';
        var lastDay = partes[0] + '-12-31';

        return { primerDia: firstDay, ultimoDia: lastDay };
    },

    indexOf(array, findKey, value) {
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if(element[findKey] == value) {
                return i;
            }
        }
        return -1;
    },

    buildTextQuery(table, fields, where, options){
        var finalOrder = 'ORDER BY RANK DESC';
        if(!options.defaultOrder){ 
          finalOrder = 'ORDER BY ' + options.orderBy + ' ' + options.direction;
        }
    
        var countQuery = `
            SELECT COUNT(*) total
            FROM ` + table + ` 
            INNER JOIN FREETEXTTABLE(` + table + `, ` + options.field + `, '` + options.value + `') AS Rank
            ON ` + table + `.id = Rank.[KEY]
            ` + where + `
        `;
    
        var selectQuery = `
            SELECT ` + fields + ` 
            FROM ` + table + ` 
            INNER JOIN FREETEXTTABLE(` + table + `, ` + options.field + `, '` + options.value + `') AS Rank
            ON ` + table + `.id = Rank.[KEY]
            ` + where + `
            ` + finalOrder + `
            OFFSET ` + options.offset + ` ROWS FETCH NEXT ` + options.limit + ` ROWS ONLY;
        `;
    
        return { select: selectQuery, count: countQuery };
    },

    buildTextQueryFields(table, fields, where, options, searchFields){
        var finalOrder = 'ORDER BY Rank.Rank DESC';
        if(!options.defaultOrder){ 
            finalOrder = 'ORDER BY ' + options.orderBy + ' ' + options.direction;
        }
    
        var countQuery = `
            SELECT COUNT(*) total
            FROM ` + table + ` 
            INNER JOIN FREETEXTTABLE(` + table + `, (` + searchFields + `), '` + options.value + `') AS Rank
            ON ` + table + `.id = Rank.[KEY]
            ` + where + `
        `;

        var selectQuery = `
            SELECT ` + fields + `, Rank.Rank
            FROM ` + table + ` 
            INNER JOIN FREETEXTTABLE(` + table + `, (` + searchFields + `), '` + options.value + `') AS Rank
            ON ` + table + `.id = Rank.[KEY]
            ` + where + `
            ` + finalOrder + `
            OFFSET ` + options.offset + ` ROWS FETCH NEXT ` + options.limit + ` ROWS ONLY;
        `;
    
        return { select: selectQuery, count: countQuery };
    },
    
    sanitizeCorreo(correo) {
        if(correo && typeof correo == 'string') {
            correo = correo.trim();
            correo = correo.toLowerCase();
        }
        return correo;
    },

    numeroMesesParaFrecuencia(frecuenciaPago) {
        switch(frecuenciaPago) {
            case 'mensual': return 1;
            case 'bimestral': return 2;
            case 'trimestral': return 3;
            case 'semestral': return 6;
            case 'anual': return 12;
            default: return 1;
        }
    },

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
};