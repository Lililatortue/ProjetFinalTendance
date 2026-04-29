{
      description = "Final js project dev environment";

      inputs = {
            nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
      };

      outputs = { self, nixpkgs }:
            let 
                  # Change it depending on your system
                  system = "x86_64-linux";
                  pkgs = import nixpkgs {
                        inherit system;
                  };                 
            in {
                  devShells.${system}.default = pkgs.mkShell {
                        packages = with pkgs; [
                              nodejs_20
                              typescript
                              typescript-language-server
                        ];
                        shellHook = ''
                              echo "JS final project env"
                              node -v
                              npm  -v
                              tsc  -v
                        '';
                  };
            };
}
