import { Component } from "solid-js";

export const Home: Component = () => {
  return (
    <>
      <div class="columns is-gapless">
        <div class="column">
          <nav class="breadcrumb">
            <ul>
              <li class="is-active">
                <span class="icon">
                  <i class="fa-solid fa-home" />
                </span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div class="has-background-warning" style={{ height: "300px", width: "500px" }}>
        <p>This screen displays:</p>
        <p>- metadata</p>
        <p>- data statistics</p>
        <br />
        <p>
          This screen will automatically redirect to sample-variants screen in case of 1 proband or 0 probands and 1
          sample
        </p>
      </div>
    </>
  );
};
