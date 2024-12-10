import { CustomerPagingOptions } from '@cde-platform/api/lib/model/paging'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { App, AppProps } from './App'
import { RootState } from './store'
import { setErrorMessage, setPagingOptions } from './store/app.slice'

const mapState = (state: RootState, props: { onPagedDataRequested: AppProps['onPagedDataRequested'] }) => ({
  pagingOptions: state.app.pagingOptions,
  errorMessage: state.app.errorMessage,
  onPagedDataRequested: props.onPagedDataRequested,
})

const mapDispatch = (dispatch: Dispatch) => ({
  onPagingOptionsSet: (opts: CustomerPagingOptions) => dispatch(setPagingOptions(opts)),
  onError: (message?: string) => dispatch(setErrorMessage(message)),
})

export default connect(mapState, mapDispatch)(App)
