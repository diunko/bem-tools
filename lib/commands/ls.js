var Q = require('q'),
    PATH = require('../path'),
    createLevel = require('../level').createLevel,
    Context = require('../context').Context,
    U = require('../util');

module.exports = function() {

    return this
        .title('Ls').helpful()
        .opt()
            .name('level').short('l').long('level')
            .title('override level, can be used many times')
            .val(function (l) {
                return typeof l === 'string'? createLevel(l) : l;
            })
            .arr()
            .end()
        .opt()
            .name('tech').short('T').short('t').long('tech')
            .title('technologies to list, can be used many times')
            .arr()
            .end()
        .act(function(opts, args) {
            var context = new Context(null,opts);
            var tt;
            if(opts.tech){
                tt = {};
                opts.tech.some(function(k,i){
                    tt[k] = true;
                });
            }
            var res = [];
            opts.level.forEach(function(level){
                var inspect = level.createIntrospector({
                    matcher:function(path){
                        var m = level.matchAny(path);
                        if(!tt ||
                           m && m.tech && (m.tech in tt)){
                            return m;
                        }
                    }
                })
                inspect(null,res);
            })
            res.toString = function(){
                return JSON.stringify(this,null,4);
            }
            return res;
        });

};
