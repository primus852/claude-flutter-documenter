.PHONY: release

release:
	@[ "$(v)" ] || (echo "Usage: make release v=1.2.3"; exit 1)
	./scripts/bump-version.sh $(v)
	git push origin main
	git push origin v$(v)
