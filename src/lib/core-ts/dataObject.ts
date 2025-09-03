import type { Hashable } from '@/lib/core-ts/hashable';

export interface DataObject<T, P = {}> extends Hashable {
  copy(props?: Partial<P>): T;
  toString(): string;
}
