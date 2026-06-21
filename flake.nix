{
  description = "haikubot";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        formatter = pkgs.nixfmt;

        packages.default =
          let
            pnpmDeps = pkgs.fetchPnpmDeps {
              pname = "haikubot";
              version = "1.0.0";
              src = ./.;

              pnpm = pkgs.pnpm_10;
              fetcherVersion = 3;
              hash = "sha256-iUZMoi0z5AQjq6WGEEADQakHXD2KW3CUArgO1jtJftA=";
            };
          in
          pkgs.stdenv.mkDerivation {
            pname = "haikubot";
            version = "1.0.0";
            src = ./.;

            inherit pnpmDeps;

            nativeBuildInputs =
              (with pkgs; [
                nodejs_24
                pnpm_10
                pnpmConfigHook
                makeWrapper
                python3
              ])
              ++ pkgs.lib.optionals pkgs.stdenv.hostPlatform.isDarwin [
                pkgs.darwin.cctools
              ];

            npm_config_build_from_source = "true";
            npm_config_nodedir = "${pkgs.nodejs_24}";

            buildPhase = ''
              pnpm rebuild better-sqlite3
              pnpm build
            '';

            installPhase = ''
              mkdir -p "$out/lib/haikubot" "$out/bin"

              cp -r dist node_modules package.json "$out/lib/haikubot/"

              makeWrapper ${pkgs.nodejs_24}/bin/node "$out/bin/haikubot" \
                --add-flags "$out/lib/haikubot/dist/index.js"

              makeWrapper ${pkgs.nodejs_24}/bin/node "$out/bin/haikubot-deploy" \
                --add-flags "$out/lib/haikubot/dist/util/deploy-commands.js"
            '';

            meta.mainProgram = "haikubot";
          };

        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_24
            pnpm_10
            python3
          ];
        };
      }
    );
}
