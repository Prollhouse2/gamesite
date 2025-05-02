self.__uv$config = {
	prefix: "/static/petezah/",
	bare: "https://science.petezahgames.com/",
	encodeUrl: Ultraviolet.codec.xor.encode,
	decodeUrl: Ultraviolet.codec.xor.decode,
	handler: "/static/uv/uv.handler.js",
	bundle: "/static/uv/uv.bundle.js",
	config: "/static/uv/uv.config.js",
	sw: "/static/uv/uv.sw.js",
};

// There are 2 bare servers in PeteZah Games.
// The primary is hosted by Benrogo.net and is science.petezahgames.com.  It feeds off of bare.benrogo.net
// The second is hosted by me and is a backup, it is bare.petezahgames.com.
// PeteZah has hid more, and vip's can gain access to websites that have these servers.  Email contact@petezahgames.com to find out.
// bare-sigma.yourmom.eu.org is one that is blocked and yet works well.
// https://v2202412246404304352.megasrv.de/bare/ works too.  Thanks Benrogo :)!!!
