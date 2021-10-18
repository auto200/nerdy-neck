import produce, { Draft } from "immer";
import { Dispatch, useMemo, useReducer } from "react";

// source: https://github.com/immerjs/use-immer

export type Reducer<S = any, A = any> = (
  draftState: Draft<S>,
  action: A
) => void | S;

export function useImmerReducer<S = any, A = any>(
  reducer: Reducer<S, A>,
  initialState: S,
  initialAction?: (initial: any) => S
): [S, Dispatch<A>];
export function useImmerReducer(
  reducer: any,
  initialState: any,
  initialAction: any
) {
  const cachedReducer = useMemo(() => produce(reducer), [reducer]);
  return useReducer(cachedReducer, initialState, initialAction);
}
