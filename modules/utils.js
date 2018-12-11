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
}
