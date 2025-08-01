/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as RemindersRouteImport } from './routes/reminders'
import { Route as DrawRouteImport } from './routes/draw'
import { Route as IndexRouteImport } from './routes/index'

const RemindersRoute = RemindersRouteImport.update({
  id: '/reminders',
  path: '/reminders',
  getParentRoute: () => rootRouteImport,
} as any)
const DrawRoute = DrawRouteImport.update({
  id: '/draw',
  path: '/draw',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/draw': typeof DrawRoute
  '/reminders': typeof RemindersRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/draw': typeof DrawRoute
  '/reminders': typeof RemindersRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/draw': typeof DrawRoute
  '/reminders': typeof RemindersRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/draw' | '/reminders'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/draw' | '/reminders'
  id: '__root__' | '/' | '/draw' | '/reminders'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DrawRoute: typeof DrawRoute
  RemindersRoute: typeof RemindersRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/reminders': {
      id: '/reminders'
      path: '/reminders'
      fullPath: '/reminders'
      preLoaderRoute: typeof RemindersRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/draw': {
      id: '/draw'
      path: '/draw'
      fullPath: '/draw'
      preLoaderRoute: typeof DrawRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DrawRoute: DrawRoute,
  RemindersRoute: RemindersRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
