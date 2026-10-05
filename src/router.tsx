import { createBrowserRouter } from 'react-router'
import { Layout } from './components/layout/Layout'
import { RouteErrorPage } from './pages/RouteErrorPage'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductPage } from './pages/ProductPage'
import { OrderPage } from './pages/OrderPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalogo', element: <CatalogPage /> },
      { path: 'producto/:id', element: <ProductPage /> },
      { path: 'pedido', element: <OrderPage /> },
      { path: 'confirmacion', element: <ConfirmationPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
