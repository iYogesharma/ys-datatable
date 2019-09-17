/* global describe, $,chai it */
const { expect } = chai;

const table = $('#datatable').YSDataTable();

describe('$(selector).YSDataTable()', () => {
  it('shoud return object of datatable.net', () => {
    expect(table).to.be.an('object');
  });
});

describe('YSDataTable().api()', () => {
  it('shoud return object of YSDataTable()', () => {
    expect(table.api()).to.be.an('object');
  });
});

describe('YSDataTable().class()', () => {
  it('shoud return function YSDataTable()', () => {
    expect(table.class()).to.be.an('function');
  });
});

describe('$(undefined-selector).YSDataTable()', () => {
  it('shoud throw error', () => {
    expect(() => $('#datatablei').YSDataTable()).to.throw('Not able to found table with given selector');
  });
});
