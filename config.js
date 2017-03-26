
'use strict';

const WIT_TOKEN = process.env.WIT_TOKEN || 'C5HF5I3EFYJZDLMHBZITU42RCAK3PLVL'
if (!WIT_TOKEN) {
  throw new Error('Missing WIT_TOKEN. Go to https://wit.ai/docs/quickstart to get one.')
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'EAAPRFhieu38BAOJbA8DGJ1fPBMtRwbtOz2DdYq9qKY0sB8RI9ZBlrqJYf9LkIs9N5S844lhsYWXv9JYgsxQUIi6sN4xzjFkCMI3ifw8xXPWGRgL6XcfZC9ZARef9mhEQOSSwLedxozjLwjXGytWbvfRLTvWTFwhIsB1ELKmoAZDZD';
if (!FB_PAGE_TOKEN) {
	throw new Error('Missing FB_PAGE_TOKEN. Go to https://developers.facebook.com/docs/pages/access-tokens to get one.')
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'just_do_it'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}