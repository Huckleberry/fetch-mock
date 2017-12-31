const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const sinon = require('sinon');

module.exports = (fetchMock) => {
	describe('options', () => {
		let fm;
		beforeEach(() => {
			fm = fetchMock.createInstance();
		});

		describe('fallbackToNetwork', () => {
			it('error by default', () => {
				expect(() => fm.fetchHandler('http://it.at.there/')).to.throw();
			});

			it('not error when configured globally', async () => {
				fm.config.fallbackToNetwork = true;
				fm.mock('http://it.at.where', 200);
				expect(() => fm.fetchHandler('http://it.at.there/')).not.to.throw();
			});

			it('error when configured on sandbox without fetch defined', () => {
				fm.config.fallbackToNetwork = true;
				const sbx = fm.sandbox();
				expect(() => sbx.fetchHandler('http://it.at.there/')).to.throw();
			});

			it('not error when configured on sandbox with fetch defined', async () => {
				fm.config.fallbackToNetwork = true;
				fm.config.fetch = () => Promise.resolve(200);
				const sbx = fm.sandbox();
				expect(() => sbx.fetchHandler('http://it.at.there/')).not.to.throw();
			});

		});

		describe('includeContentLength', () => {
			it('include content-length header by default', async () => {
				fm.mock('*', 'string');
				const res = await fm.fetchHandler('http://it.at.there');
				expect(res.headers.get('content-length')).to.equal('6');
			});

			it('don\'t include when configured false', async () => {
				fm.config.includeContentLength = false;
				fm.mock('*', 'string');
				const res = await fm.fetchHandler('http://it.at.there');
				expect(res.headers.get('content-length')).not.to.exist;
			});

			it('local setting can override to true', async () => {
				fm.config.includeContentLength = false;
				fm.mock('*', {
					includeContentLength: true,
					body: 'string'
				});
				const res = await fm.fetchHandler('http://it.at.there');
				expect(res.headers.get('content-length')).to.equal('6');
			});

			it('local setting can override to false', async () => {
				fm.config.includeContentLength = true;
				fm.mock('*', {
					includeContentLength: false,
					body: 'string'
				});
				const res = await fm.fetchHandler('http://it.at.there');
				expect(res.headers.get('content-length')).not.to.exist;
			});

		});

		describe('sendAsJson', () => {
			it('convert object responses to json by default', async () => {
				fm.mock('*', {an: 'object'});
				const res = await fm.fetchHandler('http://it.at.there');
				expect(res.headers.get('content-type')).to.equal('application/json');
			});

			it('don\'t convert when configured false', async () => {
				fm.config.sendAsJson = false;
				fm.mock('*', {an: 'object'});
				const res = await fm.fetchHandler('http://it.at.there');
				expect(res.headers.get('content-type')).not.to.exist;
			});

			it('local setting can override to true', async () => {
				fm.config.sendAsJson = false;
				fm.mock('*', {body: {an: 'object'}, sendAsJson: true});
				const res = await fm.fetchHandler('http://it.at.there');
				expect(res.headers.get('content-type')).to.equal('application/json');
			});

			it('local setting can override to false', async () => {
				fm.config.sendAsJson = true;
				fm.mock('*', {body: {an: 'object'}, sendAsJson: false});
				const res = await fm.fetchHandler('http://it.at.there');
				expect(res.headers.get('content-type')).not.to.exist;
			});
		});

		describe.skip('warnOnFallback', () => {
			it('warn on fallback response by default', async () => {

			});

			it('don\'t warn on fallback response when configured false', async () => {

			});
		});

		describe.skip('overwriteRoutes', () => {
			it('error on duplicate routes by default', async () => {

			});

			it('allow overwriting existing route', async () => {

			});

			it('allow adding additional route with same matcher', async () => {

			});
		});
	});
};