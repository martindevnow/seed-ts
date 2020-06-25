import { RequiredParameterError } from './errors';

// TODO: Decide if this is a pattern I want to follow...
// is it worth it to have an "Error Factory" of sorts...
export default function requiredParam(param: string) {
  throw new RequiredParameterError(param);
}
