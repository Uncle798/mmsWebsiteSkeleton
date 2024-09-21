import { init } from '../serverless.js';

export const handler = init((() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["android-chrome-192x192.png","android-chrome-512x512.png","apple-touch-icon.png","favicon-16x16.png","favicon-32x32.png","favicon.ico","fonts/Quicksand.ttf"]),
	mimeTypes: {".png":"image/png",".ttf":"font/ttf"},
	_: {
		client: {"start":"_app/immutable/entry/start.DXL9zJ0d.js","app":"_app/immutable/entry/app.BtB_rxiM.js","imports":["_app/immutable/entry/start.DXL9zJ0d.js","_app/immutable/chunks/entry.CaHJRPzi.js","_app/immutable/chunks/scheduler.BxntsWxz.js","_app/immutable/chunks/index.dgzJtdmL.js","_app/immutable/entry/app.BtB_rxiM.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/scheduler.BxntsWxz.js","_app/immutable/chunks/index.CIBjKfq4.js","_app/immutable/chunks/index.DdPxwcRY.js","_app/immutable/chunks/dev-browser.CoG0geaG.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../server/nodes/0.js')),
			__memo(() => import('../server/nodes/1.js')),
			__memo(() => import('../server/nodes/2.js')),
			__memo(() => import('../server/nodes/3.js')),
			__memo(() => import('../server/nodes/4.js')),
			__memo(() => import('../server/nodes/5.js')),
			__memo(() => import('../server/nodes/6.js')),
			__memo(() => import('../server/nodes/7.js')),
			__memo(() => import('../server/nodes/8.js')),
			__memo(() => import('../server/nodes/9.js')),
			__memo(() => import('../server/nodes/10.js')),
			__memo(() => import('../server/nodes/11.js')),
			__memo(() => import('../server/nodes/12.js')),
			__memo(() => import('../server/nodes/13.js')),
			__memo(() => import('../server/nodes/14.js')),
			__memo(() => import('../server/nodes/15.js')),
			__memo(() => import('../server/nodes/16.js')),
			__memo(() => import('../server/nodes/17.js')),
			__memo(() => import('../server/nodes/18.js')),
			__memo(() => import('../server/nodes/19.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/customers",
				pattern: /^\/customers\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/login/resetPassword",
				pattern: /^\/login\/resetPassword\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/login/resetPassword/[resetToken]",
				pattern: /^\/login\/resetPassword\/([^/]+?)\/?$/,
				params: [{"name":"resetToken","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/register/addressForm",
				pattern: /^\/register\/addressForm\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/register/emailVerification",
				pattern: /^\/register\/emailVerification\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/stripe/paymentIntent",
				pattern: /^\/stripe\/paymentIntent\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/stripe/paymentIntent/_server.ts.js'))
			},
			{
				id: "/stripe/webhooks",
				pattern: /^\/stripe\/webhooks\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/stripe/webhooks/_server.ts.js'))
			},
			{
				id: "/units",
				pattern: /^\/units\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/units/available",
				pattern: /^\/units\/available\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/units/newLease",
				pattern: /^\/units\/newLease\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/units/newLease/leaseSent",
				pattern: /^\/units\/newLease\/leaseSent\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/units/newLease/payDeposit",
				pattern: /^\/units\/newLease\/payDeposit\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/units/newLease/paymentIntent",
				pattern: /^\/units\/newLease\/paymentIntent\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/units/newLease/paymentIntent/_server.ts.js'))
			},
			{
				id: "/units/[unitNum]",
				pattern: /^\/units\/([^/]+?)\/?$/,
				params: [{"name":"unitNum","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/users",
				pattern: /^\/users\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/users/newContactInfo",
				pattern: /^\/users\/newContactInfo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/users/[userId]",
				pattern: /^\/users\/([^/]+?)\/?$/,
				params: [{"name":"userId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})());
