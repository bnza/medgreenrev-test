import { mergeExpects } from "@playwright/test";
import  {expect as toBeEnabledLinkExpect } from '@lib/fixtures/toBeEnabledLink';
import  {expect as toBeDisabledLinkExpect } from '@lib/fixtures/toBeDisabledLink';

export { test } from "@playwright/test";

export const expect = mergeExpects(toBeEnabledLinkExpect, toBeDisabledLinkExpect);
