#pragma once

#include "ElModule.h"
#include <inttypes.h>

#include "../Patch.h"

class DebugLogging : public ElModule
{
public:
	DebugLogging();
	~DebugLogging();

	std::string Info();

	void Tick(const std::chrono::duration<double>& Delta);
	bool Run(const std::vector<std::string>& Args);
private:
	int enabledFlags;

	Hook NetworkLogHook;
	Hook SSLHook;
	Hook UIHook;
	Hook Game1Hook;
	Hook DebugLogFloatHook;
	Hook DebugLogIntHook;
	Hook DebugLogStringHook;
};