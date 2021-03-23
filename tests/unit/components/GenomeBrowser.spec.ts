import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex, { GetterTree, Store } from 'vuex';
import GenomeBrowser from '@/components/GenomeBrowser.vue';
import { mock } from 'ts-mockito';
import { Record } from '@molgenis/vip-report-api';

import igv from 'igv';
jest.mock('igv');

const localVue = createLocalVue();
localVue.use(Vuex);

describe('GenomeBrowser', () => {
  const genomeBrowserDbFn = jest.fn();

  let browser: any;
  let store: Store<never>;

  beforeEach(() => {
    browser = { search: jest.fn() };
    igv.createBrowser.mockResolvedValue(browser);

    const getters: GetterTree<never, never> = { genomeBrowserDb: genomeBrowserDbFn };
    store = new Vuex.Store({ getters });
  });

  it('select record for supported genomeBrowserDb', async () => {
    genomeBrowserDbFn.mockReturnValue('hg38');

    const wrapper = shallowMount(GenomeBrowser, { store, localVue });
    await wrapper.vm.$nextTick();

    const record = mock<Record>();
    record.c = '1';
    record.p = 123456;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wrapper.vm.$options.watch.selectedRecord.call(wrapper.vm, record);
    expect(browser.search).toBeCalledWith('chr1:123456');
  });

  it('deselect record for supported genomeBrowserDb', async () => {
    genomeBrowserDbFn.mockReturnValue('hg38');

    const wrapper = shallowMount(GenomeBrowser, { store, localVue });
    await wrapper.vm.$nextTick();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wrapper.vm.$options.watch.selectedRecord.call(wrapper.vm, null);
    expect(browser.search).toBeCalledWith('all');
  });

  it('select record for unsupported genomeBrowserDb', async () => {
    genomeBrowserDbFn.mockReturnValue('hg17');

    const wrapper = shallowMount(GenomeBrowser, { store, localVue });
    await wrapper.vm.$nextTick();

    const record = mock<Record>();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wrapper.vm.$options.watch.selectedRecord.call(wrapper.vm, record);
    expect(browser.search).toBeCalledTimes(0);
  });
});
