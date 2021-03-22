import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex, { GetterTree, Store } from 'vuex';
import GenomeBrowser from '@/components/GenomeBrowser.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('GenomeBrowser', () => {
  const genomeBrowserDbFn = jest.fn();

  let store: Store<never>;

  beforeEach(() => {
    const getters: GetterTree<never, never> = { genomeBrowserDb: genomeBrowserDbFn };

    store = new Vuex.Store({ getters });
  });

  it('should not render a div for genomeBrowserDb hg16', () => {
    genomeBrowserDbFn.mockReturnValue('hg16');
    const wrapper = shallowMount(GenomeBrowser, { store, localVue });
    expect(wrapper).toBeDefined();
  });

  it('should not render a div for genomeBrowserDb hg17', () => {
    genomeBrowserDbFn.mockReturnValue('hg17');
    const wrapper = shallowMount(GenomeBrowser, { store, localVue });
    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('should not render a div for genomeBrowserDb hg18', () => {
    genomeBrowserDbFn.mockReturnValue('hg18');
    const wrapper = shallowMount(GenomeBrowser, { store, localVue });
    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('should render a div for genomeBrowserDb hg19', () => {
    genomeBrowserDbFn.mockReturnValue('hg19');
    const wrapper = shallowMount(GenomeBrowser, { store, localVue });
    expect(wrapper.find('div').exists()).toBe(true);
  });

  it('should render a div for genomeBrowserDb hg38', () => {
    genomeBrowserDbFn.mockReturnValue('hg38');
    const wrapper = shallowMount(GenomeBrowser, { store, localVue });
    expect(wrapper.find('div').exists()).toBe(true);
  });

  it('should not render a div for unknown genomeBrowserDb', () => {
    genomeBrowserDbFn.mockReturnValue(null);
    const wrapper = shallowMount(GenomeBrowser, { store, localVue });
    expect(wrapper.find('div').exists()).toBe(false);
  });
});
