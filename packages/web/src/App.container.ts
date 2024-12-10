import { Customer } from '@cde-platform/api/lib/model/customer'
import { CustomerPagingOptions } from '@cde-platform/api/lib/model/paging'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { App } from './App'
import { PagedData } from './components/PagedTable'
import { RootState } from './store'
import { setPagingOptions } from './store/app.slice'

const mapState = (
  state: RootState,
  props: { onPagedDataRequested: (opts: CustomerPagingOptions) => Promise<PagedData<Customer>> },
) => ({
  pagingOptions: state.app.pagingOptions,
  onPagedDataRequested: props.onPagedDataRequested,
})

const mapDispatch = (dispatch: Dispatch) => ({
  onPagingOptionsSet: (opts: CustomerPagingOptions) => dispatch(setPagingOptions(opts)),
})

export default connect(mapState, mapDispatch)(App)
