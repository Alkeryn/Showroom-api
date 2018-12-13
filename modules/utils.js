fs=require('fs');
module.exports = {
    xorAr: function(a,b){
	for(x in a){
	    for(y in b){
		if(b[y] == a[x]){
		    b.splice(y,1)
		}
	    }
	}
	return b;
    },
    delStr: function(string,del){
	while(string.includes(del)){
	    string=string.split(del);
	    string=string.join('');
	}
	return string;
    },
    objtoArr: function(obj){
    	let arr = [];
	for(x in obj){
	    arr.push(obj[x]);
	}
	return arr
    },
    isEmtpy: function(obj){
	for(x in obj){
	    return false;
	}
	return true;
    },
    isObject: function(obj){
	    if(typeof obj === 'object' && obj !== null){
	    	return true;
	    }
    },
    sanitizepath: function(bind,path){
	bind=this.delStr(bind,'..');   // ..
	bind=this.delStr(bind,'\\\/'); // \/
	bind=this.delStr(bind,'\\\\'); // \\
	bind=this.delStr(bind,'\/\/'); // //
	bind=this.delStr(bind,'.\/');  // ./

	if(bind.startsWith("/")){
	    bind=bind.substring(1);
	}
	if(fs.existsSync(path+bind)){
	    if(fs.lstatSync(path+bind).isSymbolicLink()) throw("Oh no you aren't (binding a volume to a symlink is forbidden since i don't trust you)");
	}
	bind='./'+bind
	return bind
    },
}
