
'use strict';

const WIT_TOKEN = process.env.WIT_TOKEN || 'ARONGPZAPQGFIQFYJMDSIWEGJY3SLCBZ'
if (!WIT_TOKEN) {
  throw new Error('Missing WIT_TOKEN. Go to https://wit.ai/docs/quickstart to get one.')
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'EAAPRFhieu38BAHjjDXZAVBR60sUrTYbrC5d5C3AZC2YHaJhYKWbLuVMk8USWh4bU5n7ZCap3Lmc8sBbSQeO28fGQChkl6ZC01InuErkZAfE2WmMqpYjj2RA3LJVDEpovAjqIrPOo42cGyywWYNJuWNZCaa6eXZCjn30Rstiw7sThQZDZD';
if (!FB_PAGE_TOKEN) {
	throw new Error('Missing FB_PAGE_TOKEN. Go to https://developers.facebook.com/docs/pages/access-tokens to get one.')
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'just_do_it'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}