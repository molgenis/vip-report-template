import { Component } from "solid-js";
import { Breadcrumb } from "../components/Breadcrumb";
import { useNavigate } from "@solidjs/router";
import { href } from "../utils/utils.ts";

export const Home: Component = () => {
  const navigate = useNavigate();

  return (
    <>
      <Breadcrumb items={[]} />
      <div class="columns is-centered">
        <div class="column is-three-quarters-widescreen">
          <p class="title is-2">Report</p>
          <p class="subtitle is-4">
            Analyze annotated, classified and filtered variants to solve rare-disease patients
          </p>
          <div class="columns">
            <div class="column">
              <div class="buttons are-large">
                <button class="button is-large" onClick={() => navigate(href(["variants"]))}>
                  Explore Variants without samples
                </button>
                <button class="button is-large is-primary" onClick={() => navigate(href(["samples"]))}>
                  Explore Variants for samples
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
