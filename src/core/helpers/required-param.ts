import { RequiredParameterError } from './errors';

export default function requiredParam(param: string) {
  throw new RequiredParameterError(param);
}
